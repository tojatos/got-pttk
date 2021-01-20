from django.test import TestCase

from rest_framework.test import APIClient


class ApiClientTestCase(TestCase):
    fixtures = ['data.yaml']

    def setUp(self):
        self.client = APIClient()


class UserApiClientTestCase(ApiClientTestCase):
    def setUp(self):
        super(UserApiClientTestCase, self).setUp()

        self.username = 'user'
        tokens = self.client.post('/api/token/', {'username': 'user', 'password': 'user'}).data
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + tokens['access'])


class PrzodownikApiClientTestCase(ApiClientTestCase):
    def setUp(self):
        super(PrzodownikApiClientTestCase, self).setUp()

        self.username = 'user'
        tokens = self.client.post('/api/token/', {'username': 'przodownik', 'password': 'przodownik'}).data
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + tokens['access'])
