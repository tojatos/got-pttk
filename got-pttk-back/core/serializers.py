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
        fields = ['id', 'nazwa', 'punktyz', 'punktydo', 'grupagorska', 'punktypolaczenia']


class RouteSegmentSerializer(serializers.ModelSerializer):
    polaczenieid = SegmentSerializer(read_only=True)

    class Meta:
        model = Polaczenietrasy
        fields = ['id', 'polaczenieid', 'czypowrotne', 'kolejnosc']


class RouteSerializer(serializers.ModelSerializer):
    polaczeniatrasy = RouteSegmentSerializer(many=True, read_only=True)

    class Meta:
        model = Trasa
        fields = ['id', 'datarozpoczecia', 'datazakonczenia', 'nazwa', 'polaczeniatrasy']
