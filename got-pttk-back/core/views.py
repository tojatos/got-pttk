# Create your views here.
from rest_framework import permissions, generics
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView

from core.serializers import *


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


class IsSegmentOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        user_id = request.auth.payload['user_id']
        segment_id = request.parser_context['kwargs']['pk']
        user: Uzytkownik = Uzytkownik.objects.get(user_id=user_id)
        segment: Polaczenie = Polaczenie.objects.get(id=segment_id)
        if segment.tworca is None:
            return False
        return segment.tworca.user == user.user


# class PrzewodnikView(APIView):
#     permission_classes = (IsAuthenticated, IsPrzodownik)
#
#     def get(self, request):
#         user_id = request.auth.payload['user_id']
#         user: Uzytkownik = Uzytkownik.objects.get(user_id=user_id)
#         content = {'nr_legitymacji': user.numerlegitymacji}
#         return Response(content)


class RoleView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user_id = request.auth.payload['user_id']
        user: Uzytkownik = Uzytkownik.objects.get(user_id=user_id)
        return Response(user.rola.nazwa)


class SegmentsList(generics.ListCreateAPIView):
    queryset = Polaczenie.objects.filter(tworca=None)
    serializer_class = SegmentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        user_id = self.request.auth.payload['user_id']
        user: Uzytkownik = Uzytkownik.objects.get(user_id=user_id)
        serializer.save(tworca=user)


class SegmentsDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Polaczenie.objects.all()
    serializer_class = SegmentSerializer
    permission_classes = [IsAuthenticated, IsSegmentOwner]

    def perform_update(self, serializer):
        user_id = self.request.auth.payload['user_id']
        user: Uzytkownik = Uzytkownik.objects.get(user_id=user_id)
        serializer.save(tworca=user)


class UserSegmentsView(APIView):
    """
    List all user segments
    """
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user_id = request.auth.payload['user_id']
        segments = Polaczenie.objects.filter(tworca=user_id)
        serializer = SegmentSerializer(segments, many=True)
        return Response(serializer.data)


class RouteView(APIView):
    """
    List user routes
    """
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user_id = request.auth.payload['user_id']
        routes = Trasa.objects.filter(turysta=user_id)
        serializer = RouteSerializer(routes, many=True)
        return Response(serializer.data)


class PointView(APIView):
    """
    List system points
    """

    def get(self, request):
        points = Punkttrasy.objects.filter(tworca=None)
        serializer = RoutePointSerializer(points, many=True)
        return Response(serializer.data)
