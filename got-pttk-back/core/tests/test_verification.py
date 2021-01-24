from django.test import TransactionTestCase
from rest_framework import status

from core.models import Potwierdzenieprzebyciatrasy
from core.tests.common import ApiClientTestCase, UserApiClientTestCase, PrzodownikApiClientTestCase
from core.tests.data import *


class UnauthorizedVerificationApiTest(UserApiClientTestCase):
    def test_unauthorized_add(self):
        res = self.client.post('/api/verify/', test_verification, format='json')
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)


class PrzodownikVerificationApiTest(PrzodownikApiClientTestCase):
    def test_add(self):
        res = self.client.post('/api/verify/', test_verification, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        v: Potwierdzenieprzebyciatrasy = Potwierdzenieprzebyciatrasy.objects.first()
        self.assertEqual(v.czyprzodownikuczestniczyl, test_verification['czyprzodownikuczestniczyl'])
        self.assertEqual(v.przodownik.user.username, self.username)
        self.assertEqual(v.trasa.id, test_verification['trasa'])
