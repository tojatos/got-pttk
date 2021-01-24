# Create your views here.
from typing import List, Set

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


class IsRouteOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        pk = request.parser_context['kwargs']['pk']
        route: Trasa = Trasa.objects.get(id=pk)
        return route.turysta == get_jwt_user(request)


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
        if get_jwt_user(self.request).rola.nazwa == 'PRZODOWNIK':
            # all segments are needed to verify foreign routes
            return Polaczenie.objects.filter(tworca__isnull=False)
        return Polaczenie.objects.filter(tworca=get_jwt_user(self.request))


class RouteList(generics.ListCreateAPIView):
    """
    List user routes
    """
    permission_classes = [IsAuthenticated]
    serializer_class = RouteSerializer

    def get_queryset(self):
        return Trasa.objects.filter(turysta=get_jwt_user(self.request))

    def perform_create(self, serializer):
        serializer.save(turysta=get_jwt_user(self.request))


class RouteDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Trasa.objects.all()
    serializer_class = RouteSerializer
    permission_classes = [IsAuthenticated, IsRouteOwner]

    def perform_update(self, serializer):
        serializer.save(turysta=get_jwt_user(self.request))


class PointList(generics.ListAPIView):
    """
    List system points
    """
    queryset = Punkttrasy.objects.filter(tworca=None)
    serializer_class = RoutePointSerializer


class MountainGroupList(generics.ListAPIView):
    """
    List mountain groups
    """
    queryset = Grupagorska.objects.all()
    serializer_class = MountainGroupSerializer


class RoutesToVerifyList(generics.ListAPIView):
    """
    List all routes that can be verified
    """
    serializer_class = RouteSerializer
    permission_classes = [IsAuthenticated, IsPrzodownik]

    def get_queryset(self):
        # grupy_gorskie_przodownika: List[Grupagorskaprzodownika] = get_jwt_user(self.request).grupagorskaprzodownika_set.all()
        # grupy_gorskie = [g.grupagorska for g in grupy_gorskie_przodownika]
        # return Trasa.objects.filter(polaczeniatrasy__polaczenieid__grupagorska__in=grupy_gorskie, datarozpoczecia__isnull=False, datazakonczenia__isnull=False)
        return Trasa.objects.filter(datarozpoczecia__isnull=False, datazakonczenia__isnull=False) #TODO: not verified


class RouteVerificationsList(generics.ListAPIView):
    """
    List all route verifications for route
    """
    serializer_class = RouteVerificationSerializer
    permission_classes = [IsPrzodownik | IsRouteOwner]

    def get_queryset(self):
        pk = self.request.parser_context['kwargs']['pk']
        route: Trasa = Trasa.objects.get(id=pk)
        return Potwierdzenieprzebyciatrasy.objects.filter(trasa=route)


class RouteVerifiedGroups(generics.ListAPIView):
    """
    List all verified mountain groups
    """

    serializer_class = MountainGroupSerializer
    permission_classes = [IsPrzodownik | IsRouteOwner]

    def get_queryset(self):
        pk = self.request.parser_context['kwargs']['pk']
        route: Trasa = Trasa.objects.get(id=pk)
        grupy_trasy = set([p.polaczenieid.grupagorska for p in route.polaczeniatrasy.all()])

        flatten = lambda t: [item for sublist in t for item in sublist]

        potw: List[Potwierdzenieprzebyciatrasy] = Potwierdzenieprzebyciatrasy.objects.filter(trasa=route)
        if any([x.czyprzodownikuczestniczyl for x in potw]):
            return grupy_trasy
        grupy_gorskie_przodownika: Set[Grupagorskaprzodownika] = set(flatten([p.przodownik.grupagorskaprzodownika_set.all() for p in potw]))
        grupy_gorskie = set(g.grupagorska for g in grupy_gorskie_przodownika)
        return grupy_trasy.intersection(grupy_gorskie)


class RouteVerificationCreate(generics.CreateAPIView):
    """
    Create route verification for route
    """
    serializer_class = RouteVerificationSerializer
    permission_classes = [IsPrzodownik]
    queryset = Potwierdzenieprzebyciatrasy.objects.all()

    def perform_create(self, serializer):
        serializer.save(przodownik=get_jwt_user(self.request))
