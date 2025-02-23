from rest_framework import serializers
from .models import Events

class CalendarEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Events
        fields = '__all__'
