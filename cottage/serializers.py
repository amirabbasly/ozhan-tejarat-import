from rest_framework import serializers
from .models import Cottage, CottageGoods, ExportedCottages, Expenses
from proforma.models import Performa
import jdatetime
from proforma.serializers import  ProformaCSerializer
from decimal import Decimal
from django.conf import settings
from django.db import models
from accounts.models import Costumer
class JalaliDateField(serializers.Field):
    """
    Custom serializer field to handle Jalali (Persian) dates.
    Converts Jalali date strings from the frontend to Gregorian date objects for the backend,
    and vice versa.
    """

    def to_internal_value(self, data):
        """
        Convert Jalali date string to Gregorian date object.
        """
        if not data:
            return None
        try:
            # Expecting 'YYYY-MM-DD' format in Jalali calendar
            year, month, day = map(int, data.split('-'))
            jalali_date = jdatetime.date(year, month, day)
            gregorian_date = jalali_date.togregorian()
            return gregorian_date
        except (ValueError, TypeError) as e:
            raise serializers.ValidationError('Invalid date format. Expected YYYY-MM-DD in Jalali calendar.')

    def to_representation(self, value):
        """
        Convert Gregorian date object to Jalali date string.
        """
        if not value:
            return None
        try:
            return jalali_date.strftime('%Y-%m-%d')
        except (ValueError, TypeError) as e:
            raise serializers.ValidationError('Invalid date object.')
class serializerForGoods(serializers.ModelSerializer):
    proforma = ProformaCSerializer(many=False, read_only=True)
    
    class Meta:
        model = Cottage
        fields = [
            
            'cottage_number', 
            'proforma',
            'cottage_date'
        ]  
class serializerForExpenses(serializers.ModelSerializer):
    proforma = ProformaCSerializer(many=False, read_only=True)
    
    class Meta:
        model = Cottage
        fields = [
            'id',
            'cottage_number', 
            'proforma',
            'cottage_date'
        ]  
class CottageGoodsSerializer(serializers.ModelSerializer):
    cottage = serializerForGoods(read_only=True)
    class Meta:
        model = CottageGoods
        fields = '__all__'
        read_only_fields = ['id']

class CottageSerializer(serializers.ModelSerializer):
    proforma = ProformaCSerializer(many=False, read_only=True)
    cottage_goods = CottageGoodsSerializer(many=True, read_only=False)
 
    # Override the cottage_date field to handle Jalali dates
    cottage_date = serializers.CharField()
    documents = serializers.SerializerMethodField()  # Use SerializerMethodField for full URL
   

    class Meta:
        model = Cottage
        fields = [
            'cottage_number', 'cottage_date', 'proforma','refrence_number',
            'total_value','customs_value','customs_value_epl','added_value','total_expenses','quantity', 'currency_price', 'cottage_customer',
            'cottage_status', 'rafee_taahod', 'documents', 'docs_recieved',
            'rewatch','booked', 'id',"Intermediary", 'cottage_goods',
        ]
        extra_kwargs = {
            'cottage_customer': {'allow_null': True, 'required': False}
        }

        read_only_fields = ['final_price','id']

    def get_documents(self, obj):
        """
        Generate the full URL for the documents field.
        """
        request = self.context.get('request')
        if obj.documents and request:
            return request.build_absolute_uri(obj.documents.url)
        elif obj.documents:
            return f"{settings.MEDIA_URL}{obj.documents}"
        return None

    def to_internal_value(self, data):
        # Convert Jalali date to Gregorian before validation
        cottage_date_str = data.get('cottage_date')
        if cottage_date_str:
            try:
                year, month, day = map(int, cottage_date_str.split('-'))
                jalali_date = jdatetime.date(year, month, day)
                gregorian_date = jalali_date.togregorian()
                data['cottage_date'] = gregorian_date.strftime('%Y-%m-%d')
            except ValueError:
                raise serializers.ValidationError({'cottage_date': 'Invalid date format. Expected YYYY-MM-DD in Jalali calendar.'})
        return super().to_internal_value(data)

    def create(self, validated_data):
        # Pop the cottage_goods data from validated_data
        cottage_goods_data = validated_data.pop('cottage_goods', [])

        # Create the Cottage object
        cottage = Cottage.objects.create(**validated_data)

        # Now create the CottageGoods instances and associate them with the Cottage
        for cottage_good_data in cottage_goods_data:
            CottageGoods.objects.create(cottage=cottage, **cottage_good_data)

        return cottage

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
class CustomsDeclarationInputSerializer(serializers.Serializer):
    ssdsshGUID = serializers.CharField()
    urlVCodeInt = serializers.IntegerField()
    PageSize = serializers.IntegerField(min_value=1, max_value=10000) 
    StartIndex =  serializers.IntegerField(min_value=0, max_value=10000) 


class GreenCustomsDeclarationInputSerializer(serializers.Serializer):
    FullSerilaNumber = serializers.CharField(max_length=50)
    ssdsshGUID = serializers.UUIDField()
    urlVCodeInt = serializers.IntegerField()
# serializers.py

class CottageSaveSerializer(serializers.ModelSerializer):
    proforma = serializers.SlugRelatedField(
        queryset=Performa.objects.all(),
        slug_field='prf_order_no'
    )    
    # Override the cottage_date field to handle Jalali dates
    cottage_date = serializers.CharField()
    documents = serializers.SerializerMethodField()  
    # Use SerializerMethodField for full URL

    class Meta:
        model = Cottage
        fields = [
            'cottage_number', 'cottage_date', 'proforma','refrence_number',
            'total_value', 'quantity', 'currency_price', 'cottage_customer',
            'cottage_status', 'rafee_taahod', 'documents', 'docs_recieved',
            'rewatch', 'id'
        ]
        read_only_fields = ['final_price','id']
        extra_kwargs = {
            'cottage_customer': {'allow_null': True, 'required': False}
        }

    def get_documents(self, obj):
        """
        Generate the full URL for the documents field.
        """
        request = self.context.get('request')
        if obj.documents and request:
            return request.build_absolute_uri(obj.documents.url)
        elif obj.documents:
            return f"{settings.MEDIA_URL}{obj.documents}"
        return None
    

    # Remove the create and update methods
class ExportedCottagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExportedCottages
        fields = '__all__'
        read_only_fields = ['id']

class FetchCotageRemainAmountSerializer(serializers.Serializer):
    ssdsshGUID = serializers.UUIDField()
    urlVcodeInt = serializers.IntegerField()
    fullSerialNumber = serializers.CharField(max_length=50)
    total_value = serializers.CharField(max_length=50)
    cottage_date = serializers.CharField(max_length=50)
    quantity = serializers.CharField(max_length=50)
    currency_type = serializers.CharField(max_length=50)
    status = serializers.CharField(max_length=50)

class CottageNumberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cottage
        fields = ("id", "cottage_number")
from rest_framework import serializers

class ExpensesSerializer(serializers.ModelSerializer):
    # 1️⃣ write-only: accepts cottage ID in POST payload
    cottage = serializers.PrimaryKeyRelatedField(
        queryset=Cottage.objects.all(),
        write_only=True
    )
    # 2️⃣ read-only: returns nested cottage data on GET
    cottage_detail = serializerForGoods(
        source='cottage',
        read_only=True
    )

    class Meta:
        model = Expenses
        # include both fields, plus any others you have
        fields = [
            'id',
            'value',
            'description',
            'receipt',
            'cottage',         # the FK ID, write-only
            'cottage_detail',  # the nested object, read-only
            
        ]
