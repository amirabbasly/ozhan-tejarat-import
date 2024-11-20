from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Performa, ProformaDetail, ProformaPayment, RequestStatus
from .serializers import (
    PerformaSerializer,
    ProformaDetailSerializer,
    ProformaPaymentSerializer,
    RequestStatusSerializer
)
import requests
from django.db import transaction
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

# ViewSet for Performa
class PerformaViewSet(viewsets.ModelViewSet):
    queryset = Performa.objects.all()
    serializer_class = PerformaSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    @action(detail=True, methods=['get'])
    def details(self, request, pk=None):
        try:
            performa = self.get_object()
            details = performa.details.all()
            serializer = ProformaDetailSerializer(details, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Performa.DoesNotExist:
            return Response({'error': 'Performa not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error retrieving details for Performa ID {pk}: {e}")
            return Response({'error': 'An error occurred while retrieving details.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['get'])
    def payments(self, request, pk=None):
        try:
            performa = self.get_object()
            payments = ProformaPayment.objects.filter(proforma=performa)
            serializer = ProformaPaymentSerializer(payments, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Performa.DoesNotExist:
            return Response({'error': 'Performa not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error retrieving payments for Performa ID {pk}: {e}")
            return Response({'error': 'An error occurred while retrieving payments.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# APIView for handling GUID-based external API calls
class GUIDApiView(APIView):
    def post(self, request):
        ssdsshGUID = request.data.get('ssdsshGUID')
        pageSize = request.data.get('pageSize')

        if not ssdsshGUID:
            return Response({'error': 'Please enter a valid ssdsshGUID.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # First API Call
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
                "urlVCodeInt": 1242090,
                "ssdsshGUID": ssdsshGUID
            }

            # Make the first API request
            first_response = requests.post(first_api_url, headers=first_api_headers, json=first_api_payload, timeout=10)
            first_response.raise_for_status()
            first_data = first_response.json()
            first_result = first_data.get('Result')

            if not first_result or 'PerformaList' not in first_result:
                return Response({'error': "No 'PerformaList' found in the API response"}, status=status.HTTP_400_BAD_REQUEST)

            # Process each item in the first API response
            with transaction.atomic():
                for proforma_data in first_result.get('PerformaList', []):
                    prf_number = proforma_data.get('prfNumberStr')
                    if not prf_number:
                        continue

                    prf_date_str = proforma_data.get('prfDate')
                    prf_date = datetime.strptime(prf_date_str, "%m/%d/%Y %I:%M:%S %p") if prf_date_str else None

                    prf_expire_date_str = proforma_data.get('prfExpireDate')
                    prf_expire_date = datetime.strptime(prf_expire_date_str, "%m/%d/%Y %I:%M:%S %p") if prf_expire_date_str else None

                    Performa.objects.update_or_create(
                        prf_number=prf_number,
                        defaults={
                            'prfVCodeInt': proforma_data.get('prfVCodeInt'),
                            'prf_date': prf_date,
                            'prf_expire_date': prf_expire_date,
                            'prf_total_price': proforma_data.get('prfTotalPriceMny'),
                            'prf_currency_type': proforma_data.get('prfCurrencyTypeStr'),
                            'prf_seller_name': proforma_data.get('prfSellerNameEnStr'),
                            'prf_seller_country': proforma_data.get('prfCountryNameStr'),
                            'prf_order_no': proforma_data.get('prfOrderNoStr'),
                            'prf_status': proforma_data.get('prfStatusStr'),
                            'ssdsshGUID': ssdsshGUID,
                        }
                    )

            return Response({'message': 'Data from the first API successfully retrieved and stored.'}, status=status.HTTP_200_OK)

        except requests.exceptions.RequestException as e:
            logger.error(f"First API request failed: {e}")
            return Response({'error': 'Failed to retrieve data from the first API.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            logger.error(f"An unexpected error occurred: {e}")
            return Response({'error': 'An unexpected error occurred while processing the data.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

