from rest_framework import serializers
from .models import Cottage, CottageGoods
from proforma.models import Performa
import jdatetime
from django.conf import settings
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

class CottageGoodsSerializer(serializers.ModelSerializer):
    cottage = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = CottageGoods
        fields = '__all__'


class CottageSerializer(serializers.ModelSerializer):
    proforma = serializers.SlugRelatedField(
        queryset=Performa.objects.all(),
        slug_field='prf_order_no'
    )
    cottage_goods = CottageGoodsSerializer(many=True, read_only=False)
    
    # Override the cottage_date field to handle Jalali dates
    cottage_date = serializers.CharField()
    documents = serializers.SerializerMethodField()  # Use SerializerMethodField for full URL

    class Meta:
        model = Cottage
        fields = [
            'cottage_number', 'cottage_date', 'proforma',
            'total_value', 'quantity', 'currency_price', 'cottage_customer',
            'cottage_status', 'rafee_taahod', 'documents', 'docs_recieved',
            'rewatch', 'cottage_goods', 'id'
        ]
        read_only_fields = ['final_price']

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


class GreenCustomsDeclarationInputSerializer(serializers.Serializer):
    FullSerilaNumber = serializers.CharField(max_length=50)
    ssdsshGUID = serializers.UUIDField()
    urlVCodeInt = serializers.IntegerField()