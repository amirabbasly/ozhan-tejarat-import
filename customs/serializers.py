from rest_framework import serializers
from .models import HSCode, Tag, Season, Heading


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'tag']
class SeasonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Season
        fields = ['code','description','icon']

class HeadingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Heading
        fields = ['code','description']
class HSCodeSerializer(serializers.ModelSerializer):

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
            'updated_by',
            'updated_date',
           
        ]

class HSCodeDetailSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    season = SeasonSerializer(many=False, read_only=True)
    heading = HeadingSerializer(many=False, read_only=True)

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
            'updated_by',
            'updated_date',
            'tags',
            'season',
            'heading',
        ]

class HSCodeListSerializer(serializers.ModelSerializer):

    class Meta:
        model = HSCode
        fields = [
            'code',
        ]

