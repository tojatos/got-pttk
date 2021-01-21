from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from typing import List

from core.models import Polaczenie, Punktpolaczenia, Trasa, Polaczenietrasy
from core.tests.common import ApiClientTestCase, UserApiClientTestCase, PrzodownikApiClientTestCase
from core.tests.data import *


class UnauthorizedRouteApiTest(ApiClientTestCase):
    def test_unauthorized_get(self):
        res = self.client.get('/api/route/')
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unauthorized_add(self):
        res = self.client.post('/api/route/', test_route, format='json')
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unauthorized_delete(self):
        del_res = self.client.delete(f'/api/route/{1}/')
        self.assertEqual(del_res.status_code, status.HTTP_401_UNAUTHORIZED)


class UserRouteApiTest(UserApiClientTestCase):
    def assert_route(self, route: Trasa, rd: dict):
        self.assertEqual(str(route.datarozpoczecia), str(rd['datarozpoczecia']))
        self.assertEqual(str(route.datazakonczenia), str(rd['datazakonczenia']))
        self.assertEqual(str(route.nazwa), str(rd['nazwa']))
        self.assertEqual(route.turysta.user.username, self.username)
        route_conns = Polaczenietrasy.objects.filter(trasa=route)
        self.assertEqual(len(route_conns), len(rd['polaczeniatrasy']))

    def test_retrieve_route_list(self):
        res = self.client.get('/api/route/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_add_route(self):
        res = self.client.post('/api/route/', test_route, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        route: Trasa = Trasa.objects.get(turysta__user__username=self.username, nazwa=test_route['nazwa'])
        self.assert_route(route, test_route)

    def test_add_route_empty(self):
        res = self.client.post('/api/route/', test_route_empty, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        route: Trasa = Trasa.objects.get(turysta__user__username=self.username, nazwa=test_route_empty['nazwa'])
        self.assert_route(route, test_route_empty)

    def test_delete_route(self):
        res = self.client.post('/api/route/', test_route, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        route: Trasa = Trasa.objects.get(turysta__user__username=self.username, nazwa=test_route['nazwa'])
        del_res = self.client.delete(f'/api/route/{route.id}/')
        self.assertEqual(del_res.status_code, status.HTTP_204_NO_CONTENT)

        with self.assertRaises(ObjectDoesNotExist):
            Trasa.objects.get(turysta__user__username=self.username, nazwa=test_route['nazwa'])

    def test_update_route(self):
        res = self.client.post('/api/route/', test_route, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        r: Trasa = Trasa.objects.get(turysta__user__username=self.username, nazwa=test_route['nazwa'])

        put_res = self.client.put(f'/api/route/{r.id}/', test_route_empty, format='json')
        self.assertEqual(put_res.status_code, status.HTTP_200_OK)
        route: Trasa = Trasa.objects.get(id=r.id)
        self.assert_route(route, test_route_empty)

        put_res2 = self.client.put(f'/api/route/{r.id}/', test_route, format='json')
        self.assertEqual(put_res2.status_code, status.HTTP_200_OK)
        route2: Trasa = Trasa.objects.get(id=r.id)
        self.assert_route(route2, test_route)
