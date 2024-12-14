from rest_framework import serializers
from .models import Representation, Check

class RepresentationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Representation
        fields = '__all__'
        extra_kwargs = {
            'file': {'required': False, 'allow_null':True},
        }
    
    def validate_file(self, value):
        # value here is an UploadedFile instance
        valid_mime_types = ['application/pdf', 'image/jpeg', 'image/png']
        if value and value.content_type not in valid_mime_types:
            raise serializers.ValidationError('Only PDF, JPEG, or PNG files are allowed.')
        return value

class CheckSerializer(serializers.ModelSerializer):
    class Meta:
        model = Check
        fields = '__all__'
        extra_kwargs = {
            'file': {'required': False, 'allow_null':True},
        }
    