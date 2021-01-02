# Create your views here.
from rest_framework import permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.models import Uzytkownik


class HelloView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        content = {'message': 'Hello, World!'}
        return Response(content)


class IsPrzodownik(permissions.BasePermission):
    def has_permission(self, request, view):
        user_id = request.auth.payload['user_id']
        user: Uzytkownik = Uzytkownik.objects.get(user_id=user_id)
        return user.rola.nazwa == 'PRZODOWNIK'


class PrzewodnikView(APIView):
    permission_classes = (IsAuthenticated, IsPrzodownik)

    def get(self, request):
        user_id = request.auth.payload['user_id']
        user: Uzytkownik = Uzytkownik.objects.get(user_id=user_id)
        content = {'nr_legitymacji': user.numerlegitymacji}
        return Response(content)
