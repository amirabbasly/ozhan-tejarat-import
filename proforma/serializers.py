from rest_framework import serializers
from .models import Performa, ProformaDetail, ProformaPayment, RequestStatus

class PerformaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Performa
        fields = '__all__'

class ProformaDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProformaDetail
        fields = '__all__'

class ProformaPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProformaPayment
        fields = '__all__'

class RequestStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = RequestStatus
        fields = '__all__'
