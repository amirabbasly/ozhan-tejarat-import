from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from .models import Cottage, CottageGoods
from decimal import Decimal  # Import Decimal
from proforma.models import Performa  # Import Performa model
from django.http import HttpResponse, JsonResponse
from urllib.parse import urljoin
from django.views.decorators.http import require_http_methods
from django.middleware.csrf import get_token
from .serializers import CottageSerializer, CustomsDeclarationInputSerializer, GreenCustomsDeclarationInputSerializer, CottageSaveSerializer
import requests
import logging
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from django.core.files.storage import default_storage
from django.utils.text import slugify
import os
import uuid
from django.db import transaction


class FetchGoodsAPIView(APIView):
    def post(self, request):
        """
        Fetch goods for a given declaration using the external API.
        """
        gcuVcodeInt = request.data.get('gcuVcodeInt')
        ssdsshGUID = request.data.get('ssdsshGUID')
        urlVCodeInt = request.data.get('urlVCodeInt')

        if not gcuVcodeInt or not ssdsshGUID or not urlVCodeInt:
            return Response({'error': 'Missing required parameters'}, status=status.HTTP_400_BAD_REQUEST)

        # Payload for the external API
        payload = {
            'gcuVcodeint': gcuVcodeInt,
            'ssdsshGUID': ssdsshGUID,
            'urlVCodeInt': urlVCodeInt,
        }

        try:
            # Call the external API
            external_api_url = 'https://www.ntsw.ir/users/Ac/Gateway/FacadeRest/api/Customs/NTSW_GetAllGreenCustomsDeclarationGoods_V2'
            external_response = requests.post(
                external_api_url,
                json=payload,
                headers={'Content-Type': 'application/json'},
                timeout=30
            )
            external_response.raise_for_status()

            # Parse and return the external API response
            data = external_response.json()
            if data.get('ErrorCode') != 0:
                logger.error(f"External API Error: {data.get('ErrorDesc')}")
                return Response({'error': data.get('ErrorDesc', 'Error fetching goods')}, status=status.HTTP_400_BAD_REQUEST)

            return Response(data, status=status.HTTP_200_OK)

        except requests.exceptions.RequestException as e:
            logger.error(f"Error calling external API: {e}")
            return Response({'error': 'Error fetching goods from external API'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SaveCottageView(APIView):
    serializer_class = CottageSaveSerializer

    def post(self, request):
        data = request.data
        cottage_number = data.get('cottage_number')

        try:
            # Attempt to retrieve the existing Cottage
            instance = Cottage.objects.get(cottage_number=cottage_number)
            serializer = CottageSaveSerializer(instance, data=data)
            is_update = True
        except Cottage.DoesNotExist:
            # Cottage does not exist; proceed to create a new one
            serializer = CottageSaveSerializer(data=data)
            is_update = False

        if not serializer.is_valid():
            logger.debug(f"Invalid data in SaveCottageView: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                # Save the Cottage instance (create or update)
                cottage = serializer.save()

                # Handle CottageGoods
                goods_data = data.get('goods', [])
                for good in goods_data:
                    CottageGoods.objects.update_or_create(
                        goodscode=good.get('goodscode'),
                        cottage=cottage,
                        defaults={
                            'customs_value': Decimal(good.get('customs_value', '0')),
                            'import_rights': Decimal(good.get('import_rights', '0')),
                            'red_cersent': Decimal(good.get('red_cersent', '0')),
                            'total_value': Decimal(good.get('total_value', '0')),
                            'added_value': Decimal(good.get('added_value', '0')),
                            'discount': Decimal(good.get('discount', '0')),
                            'quantity': good.get('quantity', 0),
                            'goods_description': good.get('goods_description', ''),
                            # Add other fields as necessary
                        }
                    )

            if is_update:
                return Response({'message': 'Cottage updated successfully!'}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'Cottage created successfully!'}, status=status.HTTP_201_CREATED)

        except Performa.DoesNotExist:
            return Response({'error': 'Proforma not found.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error in SaveCottageView: {e}", exc_info=True)
            return Response({'error': 'An unexpected error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SaveCottageGoodsView(APIView):
    """
    API endpoint to save goods for a cottage instance.
    """
    def post(self, request):
        data = request.data  # Data from the frontend
        try:
            # Get the related cottage by its number
            cottage_number = data.get('cottage_number')
            cottage = Cottage.objects.get(cottage_number=cottage_number)

            # Process and save each good
            goods_data = data.get('goods', [])
            for good in goods_data:
                CottageGoods.objects.update_or_create(
                    goodscode=good.get('ggsVcodeInt'),
                    cottage=cottage,
                    defaults={
                        'customs_value': Decimal(good.get('customs_value', '0')),
                        'import_rights': Decimal(good.get('import_rights', '0')),
                        'red_cersent': Decimal(good.get('red_cersent', '0')),
                        'total_value': Decimal(good.get('total_value', '0')),
                        'added_value': Decimal(good.get('added_value', '0')),
                        'discount': Decimal(good.get('discount', '0')),
                        'quantity': Decimal(good.get('quantity', '0')),
                        'goods_description': good.get('ggscommodityDescription','0')

                    }
                )

            return Response({'message': 'Goods saved successfully!'}, status=status.HTTP_201_CREATED)

        except Cottage.DoesNotExist:
            return Response({'error': 'Cottage not found.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class FetchCustomsDutyInformationAPIView(APIView):
    """
    Fetch customs duty information for a specific goods item using the external API.
    """
    def post(self, request):
        ggsVcodeInt = request.data.get('ggsVcodeInt')
        ssdsshGUID = request.data.get('ssdsshGUID')
        urlVCodeInt = request.data.get('urlVCodeInt')

        if not ggsVcodeInt or not ssdsshGUID or not urlVCodeInt:
            return Response({'error': 'Missing required parameters'}, status=status.HTTP_400_BAD_REQUEST)

        payload = {
            'ggsVcodeInt': ggsVcodeInt,
            'ssdsshGUID': ssdsshGUID,
            'urlVCodeInt': urlVCodeInt,
        }

        try:
            # Call the external API
            external_api_url = 'https://www.ntsw.ir/users/Ac/Gateway/FacadeRest/api/Customs/NTSW_GetAllGreenCustomsDutyInformation_V2'
            external_response = requests.post(
                external_api_url,
                json=payload,
                headers={'Content-Type': 'application/json'},
                timeout=30
            )
            external_response.raise_for_status()

            data = external_response.json()
            if data.get('ErrorCode') != 0:
                logger.error(f"External API Error: {data.get('ErrorDesc')}")
                return Response({'error': data.get('ErrorDesc', 'Error fetching customs duty information')}, status=status.HTTP_400_BAD_REQUEST)

            return Response(data, status=status.HTTP_200_OK)

        except requests.exceptions.RequestException as e:
            logger.error(f"Error calling external API: {e}")
            return Response({'error': 'Error fetching customs duty information from external API'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CottageViewSet(viewsets.ModelViewSet):
    queryset = Cottage.objects.all()
    serializer_class = CottageSerializer
    

    # Custom action to get a cottage by number (read-only)
    @action(detail=False, methods=['get'], url_path='by-number/(?P<cottage_number>[^/.]+)')
    def get_by_cottage_number(self, request, cottage_number=None):
        try:
            cottage = Cottage.objects.get(cottage_number=cottage_number)
            serializer = CottageSerializer(cottage)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Cottage.DoesNotExist:
            return Response(
                {"error": "Cottage not found."},
                status=status.HTTP_404_NOT_FOUND
            )


    # New custom action to delete selected cottages
    @action(detail=False, methods=['post'], url_path='delete-selected')
    def delete_selected(self, request):
        """
        Custom action to delete selected cottages.
        Expects a list of cottage IDs in the request data.
        """
        ids = request.data.get('ids', [])
        if not ids:
            return Response({'error': 'No IDs provided.'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate IDs
        if not isinstance(ids, list):
            return Response({'error': 'IDs should be provided as a list.'}, status=status.HTTP_400_BAD_REQUEST)

        # Optionally, validate that the IDs are integers
        try:
            ids = [int(id) for id in ids]
        except ValueError:
            return Response({'error': 'Invalid IDs. IDs must be integers.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cottages = Cottage.objects.filter(id__in=ids)
            if not cottages.exists():
                return Response({'error': 'No cottages found for the provided IDs.'}, status=status.HTTP_404_NOT_FOUND)
            deleted_count = cottages.count()
            cottages.delete()
            return Response({'message': f'{deleted_count} cottages deleted.'}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error deleting cottages: {e}", exc_info=True)
            return Response({'error': 'An error occurred while deleting cottages.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
logger = logging.getLogger(__name__)
class CustomsDeclarationListView(APIView):
    def post(self, request):
        # Initialize the serializer with the incoming data
        serializer = CustomsDeclarationInputSerializer(data=request.data)
        if not serializer.is_valid():
            # If validation fails, return errors to the user
            logger.debug(f"Invalid input data: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Extract validated data
        validated_data = serializer.validated_data
        ssdsshGUID = str(validated_data['ssdsshGUID'])  # Convert UUID to string if necessary
        urlVCodeInt = validated_data['urlVCodeInt']
        page_size = validated_data['PageSize']
        
        # Build the payload with user-provided values
        payload = {
            "Count": 0,
            "CountryID": 0,
            "DeclarationType": 0,
            "EntranceCustomsName": "",
            "FromDeclarationDate": None,
            "FullSerialNumber": "",
            "NationalCode": "",
            "OrderRegistrationNumber": "",
            "PageSize": page_size,  # User-provided
            "PateNumber": "",
            "StartIndex": 0,
            "ToDeclarationDate": None,
            "gcudeclarationStatus": "",
            "gculCReferenceNumber": "",
            "ssdsshGUID": ssdsshGUID,  # User-provided
            "urlVCodeInt": urlVCodeInt  # User-provided
        }

        # Add additional filters from the request data if necessary
        # Example:
        # if 'someFilter' in request.data:
        #     payload['someFilter'] = request.data['someFilter']

        # Log payload for debugging
        logger.debug(f"Payload sent to NTSW API: {payload}")

        try:
            # Make the API call
            response = requests.post(
                'https://www.ntsw.ir/users/Ac/Gateway/FacadeRest/api/Customs/NTSW_GetAllCustomizeCustomsDeclaration',
                json=payload,
                headers={'Content-Type': 'application/json'},
                timeout=30
            )
            response.raise_for_status()

            # Parse the response
            data = response.json()
            logger.debug(f"Response received from NTSW API: {data}")

            if data.get('ErrorCode') != 0:
                error_desc = data.get('ErrorDesc', 'Unknown error occurred.')
                logger.error(f"NTSW API Error: {error_desc}")
                return Response({'error': error_desc}, status=status.HTTP_400_BAD_REQUEST)

            return Response(data, status=status.HTTP_200_OK)

        except requests.exceptions.RequestException as e:
            logger.error(f"RequestException: {e}")
            return Response({'error': 'Error fetching data from NTSW API'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            logger.error(f"Unexpected Error: {e}", exc_info=True)
            return Response({'error': 'An unexpected error occurred on the server.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@api_view(['POST'])
def upload_file(request, cottage_id):
    if request.method == 'POST':
        if 'file' not in request.FILES:
            return JsonResponse({'error': 'No file provided.'}, status=status.HTTP_400_BAD_REQUEST)

        file = request.FILES['file']
        
        # Get the original filename and file extension
        original_filename = file.name
        file_extension = os.path.splitext(original_filename)[1]  # Extract the file extension
        
        # Ensure the file name is safe (no path traversal)
        safe_filename = original_filename.replace(" ", "_")  # Replace spaces with underscores, if necessary

        # Construct the file path within the cottage directory
        cottage_directory = os.path.join('uploads', 'cottages', str(cottage_id))
        file_path = os.path.join(cottage_directory, safe_filename)

        # Save the file using Django's default storage
        file_path = default_storage.save(file_path, file)

        # Associate the file with the cottage instance
        try:
            cottage = Cottage.objects.get(id=cottage_id)
            cottage.documents = file_path  # Set the file path
            cottage.save()

            return JsonResponse({'file_path': file_path}, status=status.HTTP_201_CREATED)
        except Cottage.DoesNotExist:
            return JsonResponse({'error': 'Cottage not found.'}, status=status.HTTP_404_NOT_FOUND)
class GreenCustomsDeclarationView(APIView):
    """
    API view to handle requests for Green Customs Declarations.
    """

    def post(self, request):
        # Validate incoming data
        serializer = GreenCustomsDeclarationInputSerializer(data=request.data)
        if not serializer.is_valid():
            logger.debug(f"Invalid input data: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Extract validated data
        validated_data = serializer.validated_data

        FullSerilaNumber = validated_data['FullSerilaNumber']
        ssdsshGUID = str(validated_data['ssdsshGUID'])  # Convert UUID to string
        urlVCodeInt = validated_data['urlVCodeInt']

        # Build the payload for the external API
        payload = {
            "DeclarationType":0,
            "FullSerilaNumber": FullSerilaNumber,
            "ssdsshGUID": ssdsshGUID,
            "urlVCodeInt": urlVCodeInt
        }

        logger.debug(f"Payload sent to NTSW_GetGreenCustomsDeclaration API: {payload}")

        # External API endpoint
        api_url = "https://www.ntsw.ir/users/Ac/Gateway/FacadeRest/api/Customs/NTSW_GetGreenCustomsDeclaration"

        headers = {
            "Content-Type": "application/json",
            # Add other headers if required, such as Authorization
        }

        try:
            # Make the POST request to the external API
            response = requests.post(
                api_url,
                json=payload,
                headers=headers,
                timeout=30  # seconds
            )
            response.raise_for_status()  # Raise HTTPError for bad responses

            # Parse the JSON response
            api_response = response.json()
            logger.debug(f"Response received from NTSW API: {api_response}")

            # Check for API-specific error codes
            if api_response.get('ErrorCode') != 0:
                error_desc = api_response.get('ErrorDesc', 'Unknown error occurred.')
                logger.error(f"NTSW API Error: {error_desc}")
                return Response({'error': error_desc}, status=status.HTTP_400_BAD_REQUEST)

            # Optionally, you can serialize the response data here
            # For simplicity, we'll return the response as-is
            return Response(api_response, status=status.HTTP_200_OK)

        except requests.exceptions.Timeout:
            logger.error("The request to NTSW API timed out.")
            return Response({'error': 'The request to the external API timed out.'}, status=status.HTTP_504_GATEWAY_TIMEOUT)
        except requests.exceptions.ConnectionError:
            logger.error("There was a connection error while contacting NTSW API.")
            return Response({'error': 'Connection error with external API.'}, status=status.HTTP_502_BAD_GATEWAY)
        except requests.exceptions.HTTPError as http_err:
            logger.error(f"HTTP error occurred: {http_err}")
            return Response({'error': 'HTTP error occurred when contacting external API.'}, status=status.HTTP_502_BAD_GATEWAY)
        except requests.exceptions.RequestException as req_err:
            logger.error(f"RequestException: {req_err}")
            return Response({'error': 'An error occurred while requesting external API.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except ValueError:
            logger.error("Invalid JSON received from NTSW API.")
            return Response({'error': 'Invalid response format from external API.'}, status=status.HTTP_502_BAD_GATEWAY)
        except Exception as e:
            logger.error(f"Unexpected error: {e}", exc_info=True)
            return Response({'error': 'An unexpected error occurred on the server.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

