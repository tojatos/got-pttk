from rest_framework import serializers

from core.models import *


class RoutePointSerializer(serializers.ModelSerializer):
    class Meta:
        model = Punkttrasy
        fields = ['nazwa']


class SegmentPointSerializer(serializers.ModelSerializer):
    punkttrasy = RoutePointSerializer()

    class Meta:
        model = Punktpolaczenia
        fields = ['kolejnosc', 'punkttrasy']


class SegmentSerializer(serializers.ModelSerializer):
    # id = serializers.IntegerField(read_only=True)
    punktypolaczenia = SegmentPointSerializer(many=True)
    tworca = serializers.ReadOnlyField(source='tworca.user.username')

    class Meta:
        model = Polaczenie
        fields = ['id', 'nazwa', 'punktyz', 'punktydo', 'grupagorska', 'punktypolaczenia', 'tworca']

    def create(self, validated_data):
        punktypolaczenia_data = validated_data.pop('punktypolaczenia')
        polaczenie = Polaczenie.objects.create(**validated_data)
        for punktpolaczenia_data in punktypolaczenia_data:
            punkttrasy = punktpolaczenia_data.pop('punkttrasy')
            punkttrasy_instance, _ = Punkttrasy.objects.get_or_create(nazwa=punkttrasy['nazwa'], defaults={'tworca': validated_data['tworca']})
            Punktpolaczenia.objects.create(polaczenieid=polaczenie, punkttrasy=punkttrasy_instance, **punktpolaczenia_data)
        return polaczenie

    def update(self, instance, validated_data):
        instance.nazwa = validated_data.get('nazwa', instance.nazwa)
        instance.punktyz = validated_data.get('punktyz', instance.punktyz)
        instance.punktydo = validated_data.get('punktydo', instance.punktydo)
        instance.grupagorska = validated_data.get('grupagorska', instance.grupagorska)
        instance.save()

        polaczenie = Polaczenie.objects.get(id=instance.id)
        punktypolaczenia_data = validated_data.get('punktypolaczenia', instance.punktypolaczenia)
        Punktpolaczenia.objects.filter(polaczenieid=polaczenie).delete()
        for punktpolaczenia_data in punktypolaczenia_data:
            punkttrasy = punktpolaczenia_data.pop('punkttrasy')
            punkttrasy_instance, _ = Punkttrasy.objects.get_or_create(nazwa=punkttrasy['nazwa'], defaults={'tworca': validated_data['tworca']})
            Punktpolaczenia.objects.create(polaczenieid=polaczenie, punkttrasy=punkttrasy_instance, **punktpolaczenia_data)
        return instance


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
