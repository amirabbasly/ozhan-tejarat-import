import requests
from django.core.management.base import BaseCommand
from proforma.models import Performa, ProformaDetail, ProformaPayment
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Fetches Proforma data from the external API and stores it in the database'

    def handle(self, *args, **kwargs):
        # Define the API endpoint and headers
        url = "https://www.ntsw.ir/users/Ac/Gateway/FacadeRest/api/Proforma/NTSW_ProformaList"
        headers = {
            "Authorization": "Bearer YOUR_API_KEY",  # Replace with your actual API key if needed
            "Content-Type": "application/json",
        }

        # Prepare the payload
        payload = {
            "withComboData": "true",
            "pState": "9",
            "ptxtSearch": "",
            "pStartIndex": "0",
            "pPageSize": 50,
            "pSortBy": "",
            "PrfVCodeInt": 0,
            "prfplbVCodeInt": "",
            "prfromVCodeInt": "",
            "urlVCodeInt": 1242090,
            "ssdsshGUID": "84F5FE72-C97C-4BBF-9A48-C67B4F11A347"
        }

        # Send the POST request with the payload
        response = requests.post(url, headers=headers, json=payload)

        # Check if the response is successful
        if response.status_code == 200:
            data = response.json()
            result = data.get('Result', None)  # Add default None if Result is missing

            if not result:
                self.stdout.write(self.style.ERROR("No 'Result' found in the API response"))
                return

            # Print the API response for debugging
            print("API Response:", data)

            # Loop through the data and create Performa instances
            for proforma_data in result.get('PerformaList', []):  # Assuming 'PerformaList' contains the items
                prf_number = proforma_data.get('prfNumberStr')
                
                # Skip if prf_number is missing or invalid
                if not prf_number:
                    self.stdout.write(self.style.WARNING(f"Missing prf_number for data {proforma_data}"))
                    continue

                # Extract other fields and handle missing values
                prf_date_str = proforma_data.get('prfDate')
                prf_date = datetime.strptime(prf_date_str, "%m/%d/%Y %I:%M:%S %p") if prf_date_str else None
                
                prf_expire_date_str = proforma_data.get('prfExpireDate')
                prf_expire_date = datetime.strptime(prf_expire_date_str, "%m/%d/%Y %I:%M:%S %p") if prf_expire_date_str else None

                prf_total_price = proforma_data.get('prfTotalPriceMny')
                prf_currency_type = proforma_data.get('prfCurrencyTypeStr')
                prf_seller_name = proforma_data.get('prfSellerNameEnStr')
                prf_seller_country = proforma_data.get('prfCountryNameStr')
                prf_order_no = proforma_data.get('prfOrderNoStr')
                prf_status = proforma_data.get('prfStatusStr')

                # Log the extracted data
                logger.info(f"Extracted data: {proforma_data}")
                print(f"Extracted data: {proforma_data}")  # Debug print statement

                # Create the Performa instance
                proforma, created = Performa.objects.get_or_create(
                    prf_number=prf_number,
                    defaults={
                        'prf_date': prf_date,
                        'prf_expire_date': prf_expire_date,
                        'prf_total_price': prf_total_price,
                        'prf_currency_type': prf_currency_type,
                        'prf_seller_name': prf_seller_name,
                        'prf_seller_country': prf_seller_country,
                        'prf_order_no': prf_order_no,
                        'prf_status': prf_status
                    }
                )

                # Log the created Performa instance
                logger.info(f"Created Performa instance: {proforma}")
                print(f"Created Performa instance: {proforma}")  # Debug print statement

                # Create Proforma Details if available
                for prfctm in proforma_data.get('proformaStruct', {}).get('prfctmList', []):
                    prfctm_name = prfctm.get('ctmNameStr')
                    prfctm_code = prfctm.get('ctmCodeStr')
                    ProformaDetail.objects.get_or_create(
                        proforma=proforma,
                        prfctm_name=prfctm_name,
                        prfctm_code=prfctm_code
                    )
                    # Log the created ProformaDetail instance
                    logger.info(f"Created ProformaDetail instance: {prfctm}")
                    print(f"Created ProformaDetail instance: {prfctm}")  # Debug print statement

                # Create Proforma Payments if available
                for payment in proforma_data.get('karmozdPayment', {}).get('InfoList', []):
                    pmo_time_date = payment.get('pmoTimeDate')
                    pmo_amount_lng = payment.get('pmoAmountLng')
                    pmo_result_str = payment.get('pmoResultStr')
                    prs_name_str = payment.get('PayerInfo', {}).get('prsNameStr')
                    prs_email_str = payment.get('PayerInfo', {}).get('prsEmailStr')
                    ProformaPayment.objects.get_or_create(
                        proforma=proforma,
                        payment_date=datetime.strptime(pmo_time_date, "%Y-%m-%dT%H:%M:%S.%f") if pmo_time_date else None,
                        payment_amount=pmo_amount_lng,
                        payment_status=pmo_result_str,
                        payer_name=prs_name_str,
                        payer_email=prs_email_str
                    )
                    # Log the created ProformaPayment instance
                    logger.info(f"Created ProformaPayment instance: {payment}")
                    print(f"Created ProformaPayment instance: {payment}")  # Debug print statement

            self.stdout.write(self.style.SUCCESS('Successfully imported Proforma data'))
        else:
            self.stdout.write(self.style.ERROR(f'Failed to fetch data from API: {response.status_code}'))