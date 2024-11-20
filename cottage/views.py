from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from .models import Cottage
from .serializers import CottageSerializer
import requests
import logging
from django.conf import settings


class CottageViewSet(viewsets.ModelViewSet):
    queryset = Cottage.objects.all()
    serializer_class = CottageSerializer
    @action(detail=False, methods=['get'], url_path='by-number/(?P<cottage_number>[^/.]+)')
    def get_by_cottage_number(self, request, cottage_number=None):
        try:
            # Retrieve the cottage by its number
            cottage = Cottage.objects.get(cottage_number=cottage_number)
            serializer = CottageSerializer(cottage)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Cottage.DoesNotExist:
            return Response(
                {"error": "Cottage not found."},
                status=status.HTTP_404_NOT_FOUND
            )

logger = logging.getLogger(__name__)
class CustomsDeclarationListView(APIView):
    def post(self, request):
        try:


            payload = {
                "Count": 0,
                "CountryID": 0,
                "DeclarationType": 0,
                "EntranceCustomsName": "",
                "FromDeclarationDate": None,
                "FullSerialNumber": "",
                "NationalCode": "",
                "OrderRegistrationNumber": "",
                "PageSize": 20000,
                "PateNumber": "",
                "StartIndex": 0,
                "ToDeclarationDate": None,
                "gcudeclarationStatus": "",
                "gculCReferenceNumber": "",
                "ssdsshGUID": '603FF82E-5EAF-4DFA-BBC1-FA0030D686DB',
                "urlVCodeInt": '124013'
            }

            # Add filters to the payload


            # Log payload for debugging
            logger.debug(f"Payload sent to NTSW API: {payload}")

            # Make the API call
            response = requests.post(
                'https://www.ntsw.ir/users/Ac/Gateway/FacadeRest/api/Customs/NTSW_GetAllCustomizeCustomsDeclaration',
                json=payload,
                headers={'Content-Type': 'application/json'},
                timeout=10
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