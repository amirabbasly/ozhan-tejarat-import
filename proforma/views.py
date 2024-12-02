from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.db import transaction
from django.utils import timezone

from django.utils.dateparse import parse_datetime
from .models import Performa
from .serializers import (
    PerformaSerializer,

)
import requests
import logging
import json
from datetime import datetime
from dateutil import parser  # Added import for parser
from dateutil.parser import parse
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

logger = logging.getLogger(__name__)

class PerformaListView(APIView):
    def get(self, request):
        # Retrieve all Performa instances
        performas = Performa.objects.all()
        # Serialize the queryset
        serializer = PerformaSerializer(performas, many=True)
        # Return the serialized data
        return Response(serializer.data, status=status.HTTP_200_OK)

class PerformaDetailView(APIView):
    def get(self, request, prf_order_no):
        try:
            performa = Performa.objects.get(prf_order_no=prf_order_no)
            request = RequestStatus.objects.filter(performa=performa)
            proforma_details = ProformaDetail.objects.filter(performa=performa)
            # Serialize the data
            performa_serializer = PerformaSerializer(performa)
            proforma_detail_serializer = ProformaDetailSerializer(proforma_details, many=True)
            Request_status_serializer = RequestStatusSerializer(request, many=True)
            # Combine and return the data
            return Response({
                'performa': performa_serializer.data,
                'proforma_details': proforma_detail_serializer.data,
                'request_status': Request_status_serializer.data,
            }, status=status.HTTP_200_OK)
        except Performa.DoesNotExist:
            return Response({'error': 'Performa not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error retrieving details for Performa ID {id}: {e}")
            return Response({'error': 'An error occurred while retrieving details.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class GUIDApiView(APIView):
   # Ensure the user is authenticated
    def post(self, request):
        ssdsshGUID = request.data.get('ssdsshGUID')
        pageSize = request.data.get('pageSize', 10)
        urlVCodeInt = request.data.get('urlVCodeInt')

        if not ssdsshGUID:
            return Response({'error': 'Please enter a valid ssdsshGUID.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # First API Call: NTSW_ProformaList
            first_api_url = "https://www.ntsw.ir/users/Ac/Gateway/FacadeRest/api/Proforma/NTSW_ProformaList"
            first_api_headers = {
                "Content-Type": "application/json",
            }
            first_api_payload = {
                "withComboData": "true",
                "pState": "9",
                "ptxtSearch": "",
                "pStartIndex": "0",
                "pPageSize": pageSize,
                "pSortBy": "",
                "PrfVCodeInt": 0,
                "prfplbVCodeInt": "",
                "prfromVCodeInt": "",
                "urlVCodeInt": urlVCodeInt,
                "ssdsshGUID": ssdsshGUID
            }

            # Make the first API request
            first_response = requests.post(first_api_url, headers=first_api_headers, json=first_api_payload, timeout=10)
            first_response.raise_for_status()
            first_data = first_response.json()
            first_result = first_data.get('Result')

            if not first_result or 'PerformaList' not in first_result:
                logger.error(f"API Response without 'PerformaList': {json.dumps(first_data, ensure_ascii=False, indent=2)}")
                return Response({'error': "No 'PerformaList' found in the API response"}, status=status.HTTP_400_BAD_REQUEST)

            # Collect data to return to the frontend
            performa_list = []
            for proforma_data in first_result.get('PerformaList', []):
                # Prepare the data as needed
                performa_list.append({
                    'prf_number': proforma_data.get('prfNumberStr'),
                    'prfVCodeInt': proforma_data.get('prfVCodeInt'),
                    'prf_date': proforma_data.get('prfDate'),
                    'prf_expire_date': proforma_data.get('prfExpireDate'),
                    'prf_total_price': proforma_data.get('prfTotalPriceMny'),
                    'prf_currency_type': proforma_data.get('prfCurrencyTypeStr'),
                    'prf_seller_name': proforma_data.get('prfSellerNameEnStr'),
                    'prf_seller_country': proforma_data.get('prfCountryNameStr'),
                    'prf_order_no': proforma_data.get('prfOrderNoStr'),
                    'prf_status': proforma_data.get('prfStatusStr'),
                    # Add other fields as needed
                })

            # Return the collected data to the frontend
            return Response({'performas': performa_list}, status=status.HTTP_200_OK)

        except requests.exceptions.RequestException as e:
            logger.error(f"First API request failed: {e}")
            return Response({'error': 'Failed to retrieve data from the first API.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            logger.error(f"An unexpected error occurred: {e}")
            return Response({'error': 'An unexpected error occurred while processing the data.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class SaveSelectedPerformas(APIView):

    def post(self, request):
        selected_performas = request.data.get('selected_performas', [])
        if not selected_performas:
            return Response({'error': 'No performas selected.'}, status=status.HTTP_400_BAD_REQUEST)


        try:
            with transaction.atomic():
                for performa_data in selected_performas:
                    # Parse and make timezone-aware
                    try:
                        prf_date_str = performa_data.get('prf_date')
                        prf_date = parse(prf_date_str) if prf_date_str else None
                        if prf_date:
                            prf_date = timezone.make_aware(prf_date, timezone.get_default_timezone())
                    except ValueError as e:
                        logger.error(f"Error parsing prf_date '{prf_date_str}': {e}")
                        prf_date = None

                    try:
                        prf_expire_date_str = performa_data.get('prf_expire_date')
                        prf_expire_date = parse(prf_expire_date_str) if prf_expire_date_str else None
                        if prf_expire_date:
                            prf_expire_date = timezone.make_aware(prf_expire_date, timezone.get_default_timezone())
                    except ValueError as e:
                        logger.error(f"Error parsing prf_expire_date '{prf_expire_date_str}': {e}")
                        prf_expire_date = None

                    # Create or update Performa instances with ssdsshGUID
                    proforma, created = Performa.objects.update_or_create(
                        prf_number=performa_data.get('prf_number'),
                        defaults={
                            'prfVCodeInt': performa_data.get('prfVCodeInt'),
                            'prf_date': prf_date,
                            'prf_expire_date': prf_expire_date,
                            'prf_total_price': performa_data.get('prf_total_price'),
                            'prf_currency_type': performa_data.get('prf_currency_type'),
                            'prf_seller_name': performa_data.get('prf_seller_name'),
                            'prf_seller_country': performa_data.get('prf_seller_country'),
                            'prf_order_no': performa_data.get('prf_order_no'),
                            'prf_status': performa_data.get('prf_status'),
                            # Add other fields as needed
                        }
                    )
                    logger.info(f"Created or updated Performa: {proforma}")


            return Response({'message': 'Selected performas saved successfully.'}, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error saving selected performas: {e}")
            return Response({'error': 'An error occurred while saving the selected performas.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)