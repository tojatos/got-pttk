from django.contrib.auth import get_user_model
from django.test import TestCase

from rest_framework import status
from rest_framework.test import APIClient


class ApiClientTestCase(TestCase):
    fixtures = ['data.yaml']

    def setUp(self):
        self.client = APIClient()


class UserApiClientTestCase(ApiClientTestCase):
    def setUp(self):
        super(UserApiClientTestCase, self).setUp()

        tokens = self.client.post('/api/token/', {'username': 'user', 'password': 'user'}).data
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + tokens['access'])


class SegmentsApiTest(ApiClientTestCase):
    def test_retrieve_segment_list(self):
        res = self.client.get('/api/segments/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 967)


class UnauthorizedUserSegmentsApiTest(ApiClientTestCase):
    def test_unauthorized(self):
        res = self.client.get('/api/user_segments/')
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class UserSegmentsApiTest(UserApiClientTestCase):
    def test_retrieve_user_segments(self):
        res = self.client.get('/api/user_segments/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)
