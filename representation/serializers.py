from rest_framework import serializers
from .models import Representation, Check
from accounts.models import Costumer

class CustomerRepSerializer(serializers.ModelSerializer):
    class Meta:
        model = Costumer
        fields = ['id', 'full_name']
class RepresentationSerializer(serializers.ModelSerializer):
    representi  = serializers.PrimaryKeyRelatedField(
                      queryset=Costumer.objects.all(),
                      many=True,
                      write_only=True
                  )
    representor = serializers.PrimaryKeyRelatedField(
                      queryset=Costumer.objects.all(),
                      many=True,
                      write_only=True
                  )
    applicant   = serializers.PrimaryKeyRelatedField(
                      queryset=Costumer.objects.all(),
                      write_only=True
                      allow_null=True,     # <— here
                      required=False       # <— and here

                  )

    # nested read-only for GETs
    principal      = CustomerRepSerializer(
                         source='representi',
                         many=True,
                         read_only=True
                     )
    attorney       = CustomerRepSerializer(
                         source='representor',
                         many=True,
                         read_only=True
                     )
    applicant_info = CustomerRepSerializer(
                         source='applicant',
                         read_only=True
                     )

    class Meta:

        model = Representation
        fields = [
            'id', 'representi', 'representor', 'applicant',
            'start_date', 'end_date', 'another_deligation',
                        'principal', 'attorney', 'applicant_info',

            'representor_dismissal', 'representation_summary',
            'doc_number', 'verification_code', 'file',]
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


class SummarySerializer(serializers.Serializer):
    passed_checks_count = serializers.IntegerField()
    unpassed_checks_count = serializers.IntegerField()
    passed_checks_value = serializers.IntegerField()
    unpassed_checks_value = serializers.IntegerField()
    past_representations_count = serializers.IntegerField()
    unpast_representations_count = serializers.IntegerField()

   