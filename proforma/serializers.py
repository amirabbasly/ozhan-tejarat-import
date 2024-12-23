from rest_framework import serializers
import jdatetime
import logging
from .models import Performa

logger = logging.getLogger(__name__)
class PerformaSerializer(serializers.ModelSerializer):


    class Meta:
        model = Performa
        fields = [
            'id',
            'prf_order_no',
            'prf_number',
            'prf_total_price',
            'prf_currency_type',
            'prf_seller_name',
            'prf_seller_country',
            'prf_status',
            'prf_date',  # Writable field
            'prf_expire_date',  # Writable field
            'prfVCodeInt',
            'remaining_total'
        ]

