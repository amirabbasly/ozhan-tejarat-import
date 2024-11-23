from rest_framework import serializers
from .models import Cottage
from proforma.models import Performa

class CottageSerializer(serializers.ModelSerializer):
    proforma = serializers.SlugRelatedField(
        queryset=Performa.objects.all(),
        slug_field='prf_order_no'
    )

    class Meta:
        model = Cottage
        fields = [
             'cottage_number', 'cottage_date', 'proforma',
            'total_value', 'quantity'
        ]
        read_only_fields = ['final_price']

    def create(self, validated_data):
        cottage = Cottage(**validated_data)
        cottage.final_price = cottage.calculate_final_price()
        cottage.save()
        return cottage

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.final_price = instance.calculate_final_price()
        instance.save()
        return instance
class CustomsDeclarationInputSerializer(serializers.Serializer):
    ssdsshGUID = serializers.CharField()
    urlVCodeInt = serializers.IntegerField()
    PageSize = serializers.IntegerField(min_value=1, max_value=10000) 


class GreenCustomsDeclarationInputSerializer(serializers.Serializer):
    FullSerilaNumber = serializers.CharField(max_length=50)
    ssdsshGUID = serializers.UUIDField()
    urlVCodeInt = serializers.IntegerField()