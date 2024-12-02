from rest_framework import serializers
from .models import Performa

class PerformaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Performa
        fields = '__all__'

