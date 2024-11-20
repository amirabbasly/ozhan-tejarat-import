from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.db import transaction
from django.utils.dateparse import parse_datetime
from .models import Performa, ProformaDetail, ProformaPayment, RequestStatus
from .serializers import (
    PerformaSerializer,
    ProformaDetailSerializer,
    ProformaPaymentSerializer,
    RequestStatusSerializer
)
import requests
import logging
import json
from datetime import datetime
from dateutil import parser  # Added import for parser

logger = logging.getLogger(__name__)

class PerformaListView(APIView):


    def get(self, request):
        performas = Performa.objects.all()
        performa_serializer = PerformaSerializer(performa)
        proforma_detail_serializer = ProformaDetailSerializer(proforma_details, many=True)

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

            # Process each item in the first API response
            with transaction.atomic():
                for proforma_data in first_result.get('PerformaList', []):
                    prf_number = proforma_data.get('prfNumberStr')
                    if not prf_number:
                        logger.warning("Skipped Proforma without 'prfNumberStr'")
                        continue  # Skip if no prf_number

                    # Parse dates with error handling
                    prf_date = None
                    try:
                        prf_date_str = proforma_data.get('prfDate')
                        if prf_date_str:
                            prf_date = datetime.strptime(prf_date_str, "%m/%d/%Y %I:%M:%S %p")
                    except ValueError as e:
                        logger.error(f"Error parsing prfDate '{prf_date_str}': {e}")

                    try:
                        prf_expire_date_str = proforma_data.get('prfExpireDate')
                        prf_expire_date = datetime.strptime(prf_expire_date_str, "%m/%d/%Y %I:%M:%S %p") if prf_expire_date_str else None
                    except ValueError as e:
                        logger.error(f"Error parsing prfExpireDate '{prf_expire_date_str}': {e}")
                        prf_expire_date = None  # or set a default date if preferred

                    # Create or update Performa instances in your database
                    proforma, created = Performa.objects.update_or_create(
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
                            'ssdsshGUID': ssdsshGUID,  # Store the GUID here
                            # Add other fields as needed
                        }
                    )
                    logger.info(f"Created or updated Performa: {proforma}")

            # Fetch all Performa instances associated with the ssdsshGUID
            performas = Performa.objects.filter(ssdsshGUID=ssdsshGUID)

            if not performas.exists():
                logger.error("No Performa entries found for the provided ssdsshGUID.")
                return Response({'error': "No Performa entries found for the provided ssdsshGUID."}, status=status.HTTP_404_NOT_FOUND)

            # Second API Call: GetRegedOrderDetails for each Performa
            second_api_url = "https://www.ntsw.ir/users/Ac/Gateway/FacadeRest/api/Proforma/GetRegedOrderDetails"
            second_api_headers = {
                "Content-Type": "application/json",
            }

            with transaction.atomic():
                for proforma in performas:
                    second_api_payload = {
                        "ssdsshGUID": ssdsshGUID,
                        "urlVCodeInt": urlVCodeInt,
                        "prfVCodeInt": proforma.prfVCodeInt,  # Include prfVCodeInt here
                    }

                    # Make the second API request
                    try:
                        second_response = requests.post(second_api_url, headers=second_api_headers, json=second_api_payload, timeout=20)
                        second_response.raise_for_status()
                        second_data = second_response.json()

                        logger.debug(f"Second API Response for Performa {proforma.prf_number}: {json.dumps(second_data, ensure_ascii=False, indent=2)}")

                        if second_data.get("ErrorCode") != 0:
                            error_desc = second_data.get("ErrorDesc", "Unknown error.")
                            logger.error(f"Second API Error for Performa {proforma.prf_number}: {error_desc}")
                            continue

                        second_result = second_data.get('Result')
                        if not second_result:
                            logger.error(f"No 'Result' found in the second API response for Performa {proforma.prf_number}.")
                            continue

                        # Process ProformaDetail
                        proforma_struct = second_result.get('proformaStruct')
                        if proforma_struct:
                            prfctm_list = proforma_struct.get('prfctmList', [])
                            for item in prfctm_list:
                                ProformaDetail.objects.update_or_create(
                                    performa=proforma,  # Correct ForeignKey field
                                    prfctm_code=item.get('ctmCodeStr'),
                                    defaults={
                                        'prfctm_name': item.get('ctmNameStr')
                                    }
                                )
                                logger.info(f"Updated ProformaDetail for Performa {proforma.prf_number}")

                        # Process karmozdPayment
                        karmozd_payment_data = second_result.get('karmozdPayment')
                        if karmozd_payment_data and 'InfoList' in karmozd_payment_data:
                            for payment_info in karmozd_payment_data.get('InfoList', []):
                                payment_date_str = payment_info.get('pmoTimeDate')
                                payment_date = parser.parse(payment_date_str) if payment_date_str else None

                                ProformaPayment.objects.update_or_create(
                                    proforma=proforma,
                                    payment_date=payment_date,
                                    defaults={
                                        'payment_amount': payment_info.get('pmoAmountLng'),
                                        'payment_status': payment_info.get('pmoResultStr'),
                                        'payer_name': payment_info.get('prsNameStr'),
                                        'payer_email': payment_info.get('prsEmailStr'),
                                    }
                                )
                                logger.info(f"Updated ProformaPayment for Performa {proforma.prf_number}")

                        # Process requestStatus
                        request_status_list = second_result.get('requestStatus', [])
                        for status_item in request_status_list:
                            try:
                                # Serialize FldDescStr
                                fld_desc_str = status_item.get('FldDescStr', [])
                                if isinstance(fld_desc_str, list):
                                    fld_desc_str = '\n'.join(fld_desc_str)
                                else:
                                    fld_desc_str = str(fld_desc_str)

                                RequestStatus.objects.update_or_create(
                                    performa=proforma,
                                    pfg_vcode_lng=status_item.get('pfgVCodeLng'),
                                    defaults={
                                        'gds_hs_code': status_item.get('gdsHSCode'),
                                        'pfg_commercial_desc_str': status_item.get('pfgCommercialDescStr'),
                                        'pgp_send_status_tny': status_item.get('pgpSendStatusTny'),
                                        'pfg_status_criteria_inquiry': status_item.get('pfgStatusCriteriaInquiry'),
                                        'pfg_status_result_request_sabtaresh': status_item.get('pfgStatusResultRequestSabtaresh'),
                                        'pgp_description_str': status_item.get('pgpDescriptionStr'),
                                        'agn_name_str': status_item.get('agnNameStr'),
                                        'agn_vcode_int': status_item.get('agnVcodeInt'),
                                        'fld_desc_str': fld_desc_str,
                                    }
                                )
                                logger.info(f"Updated RequestStatus for Performa {proforma.prf_number} from requestStatus")
                            except Exception as e:
                                logger.error(f"Error updating RequestStatus for Performa {proforma.prf_number}: {e}")

                    except requests.exceptions.RequestException as e:
                        logger.error(f"Second API request failed for Performa {proforma.prf_number}: {e}")
                        continue  # Skip to the next Performa

            return Response({'message': "Data from both APIs successfully retrieved and stored."}, status=status.HTTP_200_OK)

        except requests.exceptions.RequestException as e:
            logger.error(f"First API request failed: {e}")
            return Response({'error': 'Failed to retrieve data from the first API.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            logger.error(f"An unexpected error occurred: {e}")
            return Response({'error': 'An unexpected error occurred while processing the data.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
