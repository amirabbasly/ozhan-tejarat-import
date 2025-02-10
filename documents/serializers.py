from rest_framework import serializers
from .models import ImageTemplate

class ImageTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageTemplate
        fields = ['id', 'name', 'template_image']  # Add 'template_image' if you want to show it

class GoodSerializer(serializers.Serializer):
    index = serializers.IntegerField(required=False)  # or True if you need it
    description = serializers.CharField(required=True)
    hscode = serializers.CharField(required=True)
    quantity = serializers.CharField(required=True)
    number_of_invoices = serializers.CharField(required=True)

class OverlayTextSerializer(serializers.Serializer):
    exporter = serializers.CharField(required=True)
    consignee = serializers.CharField(required=True)
    means_of_transport = serializers.CharField(required=True)
    goods = GoodSerializer(many=True)
    template_id = serializers.IntegerField()
class FillExcelSerializer(serializers.Serializer):
    invoice_number = serializers.CharField(required=True, max_length=100)
    date = serializers.DateField(required=True)
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)