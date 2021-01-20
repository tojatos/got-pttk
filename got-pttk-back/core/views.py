# Create your views here.
from rest_framework import permissions, generics
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView

from core.serializers import *


def get_jwt_user(request) -> Uzytkownik:
    user_id = request.auth.payload['user_id']
    return Uzytkownik.objects.get(user_id=user_id)


class HelloView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        content = {'message': 'Hello, World!'}
        return Response(content)


class IsPrzodownik(permissions.BasePermission):
    def has_permission(self, request, view):
        return get_jwt_user(request).rola.nazwa == 'PRZODOWNIK'


class IsSegmentOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        segment_id = request.parser_context['kwargs']['pk']
        segment: Polaczenie = Polaczenie.objects.get(id=segment_id)
        return segment.tworca == get_jwt_user(request)


class RoleView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(get_jwt_user(request).rola.nazwa)


class SegmentsList(generics.ListCreateAPIView):
    queryset = Polaczenie.objects.filter(tworca=None)
    serializer_class = SegmentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(tworca=get_jwt_user(self.request))


class SegmentsDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Polaczenie.objects.all()
    serializer_class = SegmentSerializer
    permission_classes = [IsAuthenticated, IsSegmentOwner]

    def perform_update(self, serializer):
        serializer.save(tworca=get_jwt_user(self.request))


class UserSegmentsList(generics.ListAPIView):
    """
    List all user segments
    """
    serializer_class = SegmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Polaczenie.objects.filter(tworca=get_jwt_user(self.request))


class RouteList(generics.ListAPIView):
    """
    List user routes
    """
    permission_classes = [IsAuthenticated]
    serializer_class = RouteSerializer

    def get_queryset(self):
        return Trasa.objects.filter(turysta=get_jwt_user(self.request))


class PointList(generics.ListAPIView):
    """
    List system points
    """
    queryset = Punkttrasy.objects.filter(tworca=None)
    serializer = RoutePointSerializer
