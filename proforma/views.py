from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.db import transaction
from django.utils import timezone
import jdatetime
from django.utils.dateparse import parse_datetime
from .models import Performa
from .serializers import (
    PerformaSerializer,
    PerformaListSerializer,
    PerformaYearSumSerializer

)
from rest_framework.parsers import MultiPartParser
import requests
from decimal import Decimal, InvalidOperation
import logging
import json
from datetime import datetime
from dateutil import parser  # Added import for parser
from dateutil.parser import parse
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from accounts.permissions import IsAdmin, IsEditor , IsViewer
from django.db.models import Sum
from collections import defaultdict
from rest_framework.exceptions import ValidationError
from .utils import get_performa_combined_data, import_performa_from_excel
import os
from django.conf import settings


logger = logging.getLogger(__name__)




class PerformaCombinedDataView(APIView):
    def get(self, request):
        # Get the selected year from query params
        selected_year = request.query_params.get('year')

        if selected_year:
            # Validate the year if provided
            if not selected_year.isdigit():
                raise ValidationError({"error": "A valid year must be provided."})
            selected_year = int(selected_year)

        # Get combined data (with or without monthly data)
        data = get_performa_combined_data(selected_year)
        return Response(data)

class PerformaListView(APIView):
    def get(self, request):
        # Retrieve all Performa instances
        performas = Performa.objects.all()
        # Serialize the queryset
        serializer = PerformaListSerializer(performas, many=True)
        # Return the serialized data
        return Response(serializer.data, status=status.HTTP_200_OK)

class PerformaDetailView(APIView):
    def get(self, request, prf_order_no):
        try:
            performa = Performa.objects.get(prf_order_no=prf_order_no)
            # Serialize the data
            performa_serializer = PerformaSerializer(performa)
            return Response({
                'performa': performa_serializer.data,
            }, status=status.HTTP_200_OK)
        except Performa.DoesNotExist:
            return Response({'error': 'Performa not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error retrieving details for Performa ID {id}: {e}")
            return Response({'error': 'An error occurred while retrieving details.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class GUIDApiView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request):
        ssdsshGUID = request.data.get('ssdsshGUID')
        urlVCodeInt = request.data.get('urlVCodeInt')

        if not ssdsshGUID:
            return Response({'error': 'Please enter a valid ssdsshGUID.'}, status=status.HTTP_400_BAD_REQUEST)

        if not urlVCodeInt:
            return Response({'error': 'Please enter a valid urlVCodeInt.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # API payload and headers
            api_payload = {
                "withComboData": "true",
                "pState": "",
                "ptxtSearch": "",
                "pStartIndex": "0",
                "pPageSize": "2000",
                "pSortBy": "",
                "PrfVCodeInt": 0,
                "prfplbVCodeInt": "",
                "prfromVCodeInt": "",
                "urlVCodeInt": urlVCodeInt,
                "ssdsshGUID": ssdsshGUID
            }
            api_headers = {"Content-Type": "application/json"}

            # Make API request
            response = requests.post(
                "https://www.ntsw.ir/users/Ac/Gateway/FacadeRest/api/Proforma/NTSW_ProformaList",
                headers=api_headers,
                json=api_payload,
                timeout=10
            )
            response.raise_for_status()
            data = response.json()

            # Extract and transform data
            result = data.get('Result', {})
            performa_list_raw = result.get('PerformaList', [])

            # Filter out records where activity is "غیر فعال - ابطال"
            performa_list_filtered = [
                item for item in performa_list_raw
                if item.get('prfActiveStatusStr') != 'غیر فعال - ابطال'
            ]

            performa_list = []
            for proforma_data in performa_list_filtered:
                prf_order_no = proforma_data.get('prfOrderNoStr')

                if prf_order_no:
                    performa_list.append({
                        'prf_number': proforma_data.get('prfNumberStr'),
                        'prfVCodeInt': proforma_data.get('prfVCodeInt'),
                        'prf_date': proforma_data.get('prfOrderDate'),
                        'prf_expire_date': proforma_data.get('prfOrderExpireDate'),
                        'prf_freight_price': proforma_data.get('prfFreightCostMny'),
                        'prf_total_price': proforma_data.get('prfTotalPriceMny'),
                        'FOB': proforma_data.get('prfTotalPriceMny') - proforma_data.get('prfFreightCostMny'),
                        'prf_currency_type': proforma_data.get('prfCurrencyTypeStr'),
                        'prf_seller_country': proforma_data.get('prfCountryNameStr'),
                        'registrant': proforma_data.get('registrant'),
                        'prf_order_no': prf_order_no,
                        'bank_info': proforma_data.get('bnkNameStr'),
                        'prf_status': proforma_data.get('prfStatusStr'),
                        'activity': proforma_data.get('prfActiveStatusStr'),
                        # Add other fields as needed
                    })
                else:
                    logger.debug(f"Skipped record without 'prfOrderNoStr': {proforma_data}")

            # Log if no records found after filtering
            if not performa_list:
                logger.info("No valid performas (excluding 'غیر فعال - ابطال') found in the API response.")

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
                    # Log date strings
                    prf_date_str = performa_data.get('prf_date')
                    logger.debug(f"Received prf_date_str: {prf_date_str}")

                    prf_expire_date_str = performa_data.get('prf_expire_date')
                    logger.debug(f"Received prf_expire_date_str: {prf_expire_date_str}")

                    # Parse date strings using the correct format
                    if prf_date_str:
                        try:
                            # Parse Jalali date string 'YYYY/MM/DD' using jdatetime
                            prf_date = jdatetime.datetime.strptime(prf_date_str, '%Y/%m/%d').date().togregorian()
                        except ValueError as e:
                            logger.error(f"Error parsing prf_date '{prf_date_str}': {e}")
                            prf_date = None
                    else:
                        prf_date = None

                    if prf_expire_date_str:
                        try:
                            prf_expire_date = jdatetime.datetime.strptime(prf_expire_date_str, '%Y/%m/%d').date().togregorian()
                        except ValueError as e:
                            logger.error(f"Error parsing prf_expire_date '{prf_expire_date_str}': {e}")
                            prf_expire_date = None
                    else:
                        prf_expire_date = None

                    # Convert monetary fields to Decimal
                    try:
                        prf_freight_price = Decimal(str(performa_data.get('prf_freight_price', '0')))
                    except (InvalidOperation, TypeError) as e:
                        logger.error(f"Error converting prf_freight_price '{performa_data.get('prf_freight_price')}': {e}")
                        prf_freight_price = Decimal('0.00')

                    try:
                        prf_total_price = Decimal(str(performa_data.get('prf_total_price', '0')))
                    except (InvalidOperation, TypeError) as e:
                        logger.error(f"Error converting prf_total_price '{performa_data.get('prf_total_price')}': {e}")
                        prf_total_price = Decimal('0.00')

                    try:
                        FOB = Decimal(str(performa_data.get('FOB', '0')))
                    except (InvalidOperation, TypeError) as e:
                        logger.error(f"Error converting FOB '{performa_data.get('FOB')}': {e}")
                        FOB = Decimal('0.00')

                    # Create or update Performa instances
                    proforma, created = Performa.objects.update_or_create(
                        prf_number=performa_data.get('prf_number'),
                        defaults={
                            'prfVCodeInt': performa_data.get('prfVCodeInt'),
                            'prf_date': prf_date,
                            'prf_freight_price': prf_freight_price,
                            'FOB': FOB,
                            'prf_expire_date': prf_expire_date,
                            'prf_total_price': prf_total_price,
                            'prf_currency_type': performa_data.get('prf_currency_type'),
                            'prf_seller_country': performa_data.get('prf_seller_country'),
                            'prf_order_no': performa_data.get('prf_order_no'),
                            'prf_status': performa_data.get('prf_status'),
                            'registrant': performa_data.get('registrant'),
                        }
                    )
                    logger.info(f"Created or updated Performa: {proforma}")

            return Response({'message': 'Selected performas saved successfully.'}, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error saving selected performas: {e}", exc_info=True)
            return Response({'error': 'An error occurred while saving the selected performas.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class UpdatePerformaView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def patch(self, request, prf_order_no):
        try:
            performa = Performa.objects.get(prf_order_no=prf_order_no)
        except Performa.DoesNotExist:
            logger.error(f"Performa with order number {prf_order_no} not found.")
            return Response({'error': 'Performa not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Parsing dates for updating
        data = request.data.copy()
        date_fields = ['prf_date', 'prf_expire_date']
        for field in date_fields:
            if field in data and data[field]:
                date_str = data[field]
                try:
                    # Parse Jalali date string and convert to Gregorian
                    jalali_date = jdatetime.datetime.strptime(date_str, '%Y-%m-%d').date()
                    gregorian_date = jalali_date.togregorian()
                    data[field] = gregorian_date
                except (ValueError, TypeError) as e:
                    logger.error(f"Error parsing {field} '{date_str}': {e}")
                    return Response({f'error': f'Invalid date format for {field}. Expected YYYY/MM/DD.'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                data[field] = None

        # Update using the serializer
        serializer = PerformaSerializer(performa, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            logger.info(f"Updated Performa with order number {prf_order_no}")
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            logger.error(f"Validation error while updating Performa order number {prf_order_no}: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class PerformaDeleteView(APIView):
    """
    View to delete one or more Performa instances.
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        """
        Delete one or multiple Performa instances.
        Expects a list of `prf_order_no` in the request body.
        """
        try:
            performa_ids = request.data.get('prf_order_no_list', [])

            if not isinstance(performa_ids, list) or not performa_ids:
                return Response({'error': 'Please provide a valid list of `prf_order_no`.'}, status=status.HTTP_400_BAD_REQUEST)

            # Fetch and delete the specified performas
            performas = Performa.objects.filter(prf_order_no__in=performa_ids)
            if not performas.exists():
                return Response({'error': 'No matching performas found for the provided IDs.'}, status=status.HTTP_404_NOT_FOUND)

            deleted_count, _ = performas.delete()
            logger.info(f"Deleted {deleted_count} Performa instances.")

            return Response({'message': f'{deleted_count} performas deleted successfully.'}, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error deleting performas: {e}", exc_info=True)
            return Response({'error': 'An error occurred while deleting performas.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class PerformaCreateView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Parse the data from the request
            data = request.data.copy()

            # Parse Jalali dates and convert to Gregorian if present
            date_fields = ['prf_date', 'prf_expire_date']
            for field in date_fields:
                if field in data and data[field]:
                    date_str = data[field]
                    try:
                        # Parse Jalali date string and convert to Gregorian
                        jalali_date = jdatetime.datetime.strptime(date_str, '%Y-%m-%d').date()
                        gregorian_date = jalali_date.togregorian()
                        data[field] = gregorian_date
                    except (ValueError, TypeError) as e:
                        logger.error(f"Error parsing {field} '{date_str}': {e}")
                        return Response({f'error': f'Invalid date format for {field}. Expected YYYY/MM/DD.'}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    data[field] = None

            # Validate and save the Performa instance using the serializer
            serializer = PerformaSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                logger.info(f"Created new Performa: {serializer.data}")
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                logger.error(f"Validation error while creating Performa: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            logger.error(f"Error creating Performa: {e}", exc_info=True)
            return Response({'error': 'An error occurred while creating the Performa.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class PerformaImportView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request, *args, **kwargs):
        file = request.FILES.get('file', None)
        if not file:
            return Response({"error": "No file provided."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Save the uploaded file to a temporary directory
            temp_dir = os.path.join(settings.BASE_DIR, 'tmp')
            os.makedirs(temp_dir, exist_ok=True)  # Ensure the directory exists
            temp_file_path = os.path.join(temp_dir, file.name)

            with open(temp_file_path, 'wb+') as temp_file:
                for chunk in file.chunks():
                    temp_file.write(chunk)

            # Import Performa data
            import_performa_from_excel(temp_file_path)

            # Clean up: Delete the file after processing
            os.remove(temp_file_path)

            return Response({"Data imported successfully."}, status=status.HTTP_200_OK)

        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            # Log detailed error for debugging
            logger.error(f"Unexpected error during import: {str(e)}")
            return Response({"error": "An error occurred during import."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)