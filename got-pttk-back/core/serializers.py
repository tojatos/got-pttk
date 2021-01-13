from rest_framework import serializers
from core.models import *


class RoutePointSerializer(serializers.ModelSerializer):
    class Meta:
        model = Punkttrasy
        fields = ['nazwa']


class SegmentPointSerializer(serializers.ModelSerializer):
    punkttrasy = RoutePointSerializer(read_only=True)
    class Meta:
        model = Punktpolaczenia
        fields = ['kolejnosc', 'punkttrasy']


class SegmentSerializer(serializers.ModelSerializer):
    punktypolaczenia = SegmentPointSerializer(many=True, read_only=True)

    class Meta:
        model = Polaczenie
        fields = ['nazwa', 'punktyz', 'punktydo', 'grupagorska', 'punktypolaczenia']


# class MountainGroupSerializer(serializers.HyperlinkedModelSerializer):
#     class Meta:
#         model = Grupagorska
#         fields = 'nazwa'
