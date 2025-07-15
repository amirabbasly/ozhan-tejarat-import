from rest_framework import serializers
import jdatetime
import logging
from .models import Performa
from cottage.models import Cottage


class PerformaYearSumSerializer(serializers.Serializer):
    year = serializers.IntegerField()
    total_price = serializers.DecimalField(max_digits=20, decimal_places=2)

class CottagePSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cottage
        fields = [
            'cottage_number',
            'total_value',
            'cottage_date',
            'cottage_status'
        ]

class ProformaCSerializer(serializers.ModelSerializer):
       class Meta:
        model = Performa
        fields = [
            'prf_number',
            'prf_order_no',
            'prfVCodeInt'
        ]
class PerformaSerializer(serializers.ModelSerializer):

    cottages = CottagePSerializer(many=True, read_only=True)  # Nested serializer

    class Meta:
        model = Performa
        fields = [
            'id',
            'prf_order_no',
            'prf_number',
            'prf_freight_price',
            'FOB',
            'prf_total_price',
            'prf_currency_type',
            'prf_currency_price',
            'prf_seller_country',
            'prf_status',
            'prf_date',  # Writable field
            'prf_expire_date',  # Writable field
            'prfVCodeInt',
            'remaining_total',
            'remaining_freight_charges',
            'goods_type',
            'payment_instrument',
            'bank_info',
            'purchased_total',
            'rial_deposit',
            'cottages'  
        ]

class PerformaListSerializer(serializers.ModelSerializer):


    class Meta:
        model = Performa
        fields = [
            'id',
            'prf_order_no',
            'prf_number',
            'prf_total_price',
            'prf_currency_type',
            'prf_currency_price',
            'prf_seller_country',
            'prf_status',
            'prf_date',  # Writable field
            'prf_expire_date',  # Writable field
            'prfVCodeInt',
            'remaining_total',
            
        ]

