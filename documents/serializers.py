from rest_framework import serializers

class OverlayTextSerializer(serializers.Serializer):
    exporter = serializers.CharField(max_length=255)
    consignee = serializers.CharField(max_length=255)
    quantity = serializers.CharField(max_length=255)
    description = serializers.CharField(max_length=255)
    image = serializers.ImageField()
