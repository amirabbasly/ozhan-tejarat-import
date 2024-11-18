from django.shortcuts import render, get_object_or_404
import requests
from .models import Performa, ProformaDetail, ProformaPayment, RequestStatus
from datetime import datetime
import logging
from django.contrib import messages
from django.conf import settings
from django.db import transaction
from dateutil import parser
import json  # For logging JSON responses

logger = logging.getLogger(__name__)

def performa_list(request):
    performas = Performa.objects.all()
    return render(request, 'performa_list.html', {'performas': performas})

def performa_details(request, id):
    try:
        # Retrieve the Performa instance
        performa = get_object_or_404(Performa, id=id)
        
        # Retrieve related ProformaDetail instances
        details = performa.details.all()  # Using related_name='details'
        
        # Prepare context for the template
        context = {
            'performa': performa,
            'details': details,
        }
        
        # Render the template with context
        return render(request, 'performa_detail.html', context)
    
    except Exception as e:
        logger.error(f"Error retrieving details for Performa ID {id}: {e}")
        return render(request, 'performa_detail.html', {'error': 'An error occurred while retrieving details.'})
# proforma/views.py

def get_ssdsshGUID(request):
    if request.method == "POST":
        ssdsshGUID = request.POST.get('ssdsshGUID')
        pageSize = request.POST.get('pageSize')

        if not ssdsshGUID:
            return render(request, 'get_ssdsshGUID.html', {'error': 'Please enter a valid ssdsshGUID.'})

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
                "urlVCodeInt": 1242090,
                "ssdsshGUID": ssdsshGUID
            }

            # Make the first API request
            first_response = requests.post(first_api_url, headers=first_api_headers, json=first_api_payload, timeout=10)
            first_response.raise_for_status()
            first_data = first_response.json()
            first_result = first_data.get('Result')

            if not first_result or 'PerformaList' not in first_result:
                return render(request, 'get_ssdsshGUID.html', {'error': "No 'PerformaList' found in the API response"})

            # Process each item in the first API response
            with transaction.atomic():
                for proforma_data in first_result.get('PerformaList', []):
                    prf_number = proforma_data.get('prfNumberStr')
                    if not prf_number:
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
                messages.error(request, "No Performa entries found for the provided ssdsshGUID.")
                return render(request, 'get_ssdsshGUID.html', {'error': "No Performa entries found for the provided ssdsshGUID."})

            # Second API Call: GetRegedOrderDetails for each Performa
            second_api_url = "https://www.ntsw.ir/users/Ac/Gateway/FacadeRest/api/Proforma/GetRegedOrderDetails"
            second_api_headers = {
                "Content-Type": "application/json",
            }

            with transaction.atomic():
                for proforma in performas:
                    second_api_payload = {
                        "ssdsshGUID": ssdsshGUID,
                        "urlVCodeInt": 1242090,
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
                            messages.error(request, f"Second API Error for Performa {proforma.prf_number}: {error_desc}")
                            continue  # Skip to the next Performa

                        second_result = second_data.get('Result')
                        if not second_result:
                            messages.error(request, f"No 'Result' found in the second API response for Performa {proforma.prf_number}.")
                            continue  # Skip to the next Performa

                        # Process the second API response
                        proforma_struct = second_result.get('proformaStruct')
                        if proforma_struct:
                            # Process ProformaDetail
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
                        for status in request_status_list:
                            try:
                                # Serialize FldDescStr
                                fld_desc_str = status.get('FldDescStr', [])
                                if isinstance(fld_desc_str, list):
                                    fld_desc_str = '\n'.join(fld_desc_str)
                                else:
                                    fld_desc_str = str(fld_desc_str)

                                RequestStatus.objects.update_or_create(
                                    performa=proforma,
                                    pfg_vcode_lng=status.get('pfgVCodeLng'),
                                    defaults={
                                        'gds_hs_code': status.get('gdsHSCode'),
                                        'pfg_commercial_desc_str': status.get('pfgCommercialDescStr'),
                                        'pgp_send_status_tny': status.get('pgpSendStatusTny'),
                                        'pfg_status_criteria_inquiry': status.get('pfgStatusCriteriaInquiry'),
                                        'pfg_status_result_request_sabtaresh': status.get('pfgStatusResultRequestSabtaresh'),
                                        'pgp_description_str': status.get('pgpDescriptionStr'),
                                        'agn_name_str': status.get('agnNameStr'),
                                        'agn_vcode_int': status.get('agnVcodeInt'),
                                        'fld_desc_str': fld_desc_str,
                                    }
                                )
                                logger.info(f"Updated RequestStatus for Performa {proforma.prf_number} from requestStatus")
                            except Exception as e:
                                logger.error(f"Error updating RequestStatus for Performa {proforma.prf_number}: {e}")

                    except requests.exceptions.RequestException as e:
                        logger.error(f"Second API request failed for Performa {proforma.prf_number}: {e}")
                        messages.error(request, f"Failed to retrieve details for Performa {proforma.prf_number}.")
                        continue  # Skip to the next Performa

            messages.success(request, "Data from both APIs successfully retrieved and stored.")
            return render(request, 'get_ssdsshGUID.html', {'success': True})

        except requests.exceptions.RequestException as e:
            logger.error(f"First API request failed: {e}")
            return render(request, 'get_ssdsshGUID.html', {'error': 'Failed to retrieve data from the first API.'})

        except Exception as e:
            logger.error(f"An unexpected error occurred: {e}")
            return render(request, 'get_ssdsshGUID.html', {'error': 'An unexpected error occurred while processing the data.'})

    return render(request, 'get_ssdsshGUID.html')
