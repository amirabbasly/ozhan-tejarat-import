from rest_framework import serializers
from .models import HSCode, Tag


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'tag']


class HSCodeSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = HSCode
        fields = [
            'id',
            'code',
            'goods_name_fa',
            'goods_name_en',
            'profit',
            'customs_duty_rate',
            'priority',
            'SUQ',
            'tags',
        ]
