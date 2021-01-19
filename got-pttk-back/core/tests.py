from django.test import TestCase

from rest_framework import status
from rest_framework.test import APIClient
from typing import List

from core.models import Polaczenie, Punktpolaczenia


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


class SegmentsApiTest(ApiClientTestCase):
    def test_retrieve_segment_list(self):
        res = self.client.get('/api/segments/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 967)


class UnauthorizedUserSegmentsApiTest(ApiClientTestCase):
    def test_unauthorized(self):
        res = self.client.get('/api/user_segments/')
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


test_segment = {
    "id": 1234,
    "nazwa": "Testowe połączenie POST 2",
    "punktyz": 3,
    "punktydo": 5,
    "grupagorska": "Bieszczady",
    "punktypolaczenia": [
        {
            "kolejnosc": 1,
            "punkttrasy": {
                "nazwa": "Adam i Ewa"
            }
        },
        {
            "kolejnosc": 2,
            "punkttrasy": {
                "nazwa": "Babica (728 m)"
            }
        }
    ]
}

nonexistent_points_test_segment = {
    "id": 1234,
    "nazwa": "Testowe połączenie POST 2",
    "punktyz": 3,
    "punktydo": 5,
    "grupagorska": "Bieszczady",
    "punktypolaczenia": [
        {
            "kolejnosc": 1,
            "punkttrasy": {
                "nazwa": "Adam i Ewa"
            }
        },
        {
            "kolejnosc": 2,
            "punkttrasy": {
                "nazwa": "Babica (728 m)"
            }
        },
        {
            "kolejnosc": 3,
            "punkttrasy": {
                "nazwa": "Nieistniejący"
            }
        }
    ]
}


class UnauthorizedSegmentsApiTest(ApiClientTestCase):
    def test_unauthorized_add(self):
        res = self.client.post('/api/user_segments/', test_segment, format='json')
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class UserSegmentsApiTest(UserApiClientTestCase):
    def test_retrieve_user_segments(self):
        res = self.client.get('/api/user_segments/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)

    def test_add_user_segment(self):
        res = self.client.post('/api/segments/', test_segment, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        conn = Polaczenie.objects.get(tworca__user__username=self.username, nazwa=test_segment['nazwa'])
        # self.assertEqual(conn.id, 974)
        self.assertEqual(conn.nazwa, test_segment['nazwa'])
        self.assertEqual(conn.punktyz, test_segment['punktyz'])
        self.assertEqual(conn.punktydo, test_segment['punktydo'])
        self.assertEqual(conn.grupagorska.nazwa, test_segment['grupagorska'])
        self.assertEqual(conn.tworca.user.username, self.username)
        conn_points = Punktpolaczenia.objects.filter(polaczenieid=conn)
        self.assertEqual(len(conn_points), 2)

    def test_add_nonexistent_points_user_segment(self):
        test_segment = nonexistent_points_test_segment
        res = self.client.post('/api/segments/', test_segment, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        conn = Polaczenie.objects.get(tworca__user__username=self.username, nazwa=test_segment['nazwa'])
        # self.assertEqual(conn.id, 974)
        self.assertEqual(conn.nazwa, test_segment['nazwa'])
        self.assertEqual(conn.punktyz, test_segment['punktyz'])
        self.assertEqual(conn.punktydo, test_segment['punktydo'])
        self.assertEqual(conn.grupagorska.nazwa, test_segment['grupagorska'])
        self.assertEqual(conn.tworca.user.username, self.username)
        conn_points: List[Punktpolaczenia] = Punktpolaczenia.objects.filter(polaczenieid=conn)
        self.assertEqual(len(conn_points), 3)
        pt = conn_points[2].punkttrasy
        self.assertIsNotNone(pt.tworca)
        self.assertEqual(pt.tworca.user.username, self.username)
