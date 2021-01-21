from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from typing import List

from core.models import Polaczenie, Punktpolaczenia
from core.tests.common import ApiClientTestCase, UserApiClientTestCase, PrzodownikApiClientTestCase
from core.tests.data import *


class SegmentsApiTest(ApiClientTestCase):
    def test_retrieve_segment_list(self):
        res = self.client.get('/api/segments/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 967)


class UnauthorizedUserSegmentsApiTest(ApiClientTestCase):
    def test_unauthorized(self):
        res = self.client.get('/api/user_segments/')
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class UnauthorizedSegmentsApiTest(ApiClientTestCase):
    def test_unauthorized_add(self):
        res = self.client.post('/api/segments/', test_segment, format='json')
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unauthorized_delete(self):
        del_res = self.client.delete(f'/api/segments/{1}/')
        self.assertEqual(del_res.status_code, status.HTTP_401_UNAUTHORIZED)


class UnauthorizedPrzodownikSegmentsApiTest(PrzodownikApiClientTestCase):
    def test_unauthorized_delete_system(self):
        del_res = self.client.delete(f'/api/segments/{1}/')
        self.assertEqual(del_res.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthorized_delete_other(self):
        del_res = self.client.delete(f'/api/segments/{972}/')
        self.assertEqual(del_res.status_code, status.HTTP_403_FORBIDDEN)


class UserSegmentsApiTest(UserApiClientTestCase):
    def assert_segment(self, conn: Polaczenie, segment: dict):
        self.assertEqual(conn.nazwa, segment['nazwa'])
        self.assertEqual(conn.punktyz, segment['punktyz'])
        self.assertEqual(conn.punktydo, segment['punktydo'])
        self.assertEqual(conn.grupagorska.nazwa, segment['grupagorska'])
        self.assertEqual(conn.tworca.user.username, self.username)
        conn_points = Punktpolaczenia.objects.filter(polaczenieid=conn)
        self.assertEqual(len(conn_points), len(segment['punktypolaczenia']))

    def test_retrieve_user_segments(self):
        res = self.client.get('/api/user_segments/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)

    def test_add_user_segment(self):
        res = self.client.post('/api/segments/', test_segment, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        conn = Polaczenie.objects.get(tworca__user__username=self.username, nazwa=test_segment['nazwa'])
        self.assert_segment(conn, test_segment)

    def test_add_nonexistent_points_user_segment(self):
        test_segment = nonexistent_points_test_segment
        res = self.client.post('/api/segments/', test_segment, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        conn = Polaczenie.objects.get(tworca__user__username=self.username, nazwa=test_segment['nazwa'])
        self.assert_segment(conn, test_segment)
        conn_points: List[Punktpolaczenia] = Punktpolaczenia.objects.filter(polaczenieid=conn)
        pt = conn_points[2].punkttrasy
        self.assertIsNotNone(pt.tworca)
        self.assertEqual(pt.tworca.user.username, self.username)

    def test_delete_user_segment(self):
        res = self.client.post('/api/segments/', test_segment, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        conn: Polaczenie = Polaczenie.objects.get(tworca__user__username=self.username, nazwa=test_segment['nazwa'])
        del_res = self.client.delete(f'/api/segments/{conn.id}/')
        self.assertEqual(del_res.status_code, status.HTTP_204_NO_CONTENT)

        with self.assertRaises(ObjectDoesNotExist):
            Polaczenie.objects.get(tworca__user__username=self.username, nazwa=test_segment['nazwa'])

    def test_update_user_segment(self):
        res = self.client.post('/api/segments/', test_segment, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        c: Polaczenie = Polaczenie.objects.get(tworca__user__username=self.username, nazwa=test_segment['nazwa'])
        put_res = self.client.put(f'/api/segments/{c.id}/', updated_segment, format='json')
        self.assertEqual(put_res.status_code, status.HTTP_200_OK)
        conn: Polaczenie = Polaczenie.objects.get(tworca__user__username=self.username, nazwa=updated_segment['nazwa'])
        self.assert_segment(conn, updated_segment)
        conn_points: List[Punktpolaczenia] = Punktpolaczenia.objects.filter(polaczenieid=conn)
        self.assertEqual([x for x in conn_points if x.kolejnosc == 2][0].punkttrasy.nazwa, "Adam i Ewa")

