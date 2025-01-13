# hscode/views.py

import pandas as pd
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets, status, filters
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import action
from .models import HSCode, Tag
import requests
from .serializers import HSCodeSerializer, TagSerializer
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from .filters import HSCodeFilter  # Import the filter set
import re

class CustomPageNumberPagination(PageNumberPagination):
    page_size_query_param = 'page_size'
    max_page_size = 600

class HSCodeViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for managing HSCode objects.
    Provides list, retrieve, create, update, and delete functionality.
    """
    queryset = HSCode.objects.all().order_by("id")
    serializer_class = HSCodeSerializer
    pagination_class = CustomPageNumberPagination  # Apply pagination here
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_class = HSCodeFilter
    search_fields = ["code", "goods_name_fa", "goods_name_en"]

    @action(detail=True, methods=['post'], url_path='add-tags')
    def add_tags(self, request, pk=None):
        """
        Custom action to add tags to an existing HSCode.
        """
        hscode = self.get_object()
        tags = request.data.get("tags", [])

        if not tags or not isinstance(tags, list):
            return Response(
                {"detail": "Invalid or missing 'tags'. It should be a list."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        for tag_name in tags:
            tag, _ = Tag.objects.get_or_create(tag=tag_name)
            hscode.tags.add(tag)

        hscode.save()
        return Response(
            {
                "detail": "Tags added successfully.",
                "tags": TagSerializer(hscode.tags.all(), many=True).data,
            },
            status=status.HTTP_200_OK,
        )
class HSCodeImportView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, format=None):
        if 'excel_file' not in request.FILES:
            return Response(
                {"detail": "No Excel file provided."},
                status=status.HTTP_400_BAD_REQUEST
            )

        excel_file = request.FILES['excel_file']

        # Force the columns that might have leading zeros to be read as strings
        # (Adjust the column names to match your actual Excel headers)
        df = pd.read_excel(
            excel_file,
            dtype={
                "TableNumberFix": str,  # preserve leading zeros in TableNumberFix
                # If you have other columns needing leading zeros, add them here as well.
            }
        )

        # Now the column "TableNumberFix" remains as a string with leading zeros, if present
        for _, row in df.iterrows():
            HSCode.objects.update_or_create(
                code=row.get('TableNumberFix', ''),
                goods_name_en=row.get('TableKalaNameEN', ''),
                goods_name_fa=row.get('TableKalaName', ''),
                profit=row.get('TableCommercialbenefit', ''),
                SUQ=row.get('TableSUQ', ''),
                priority=row.get('commodityPriority',''),
                customs_duty_rate=row.get('TableVorodi', ''),
            )

        return Response(
            {"detail": "HSCode Excel imported successfully."},
            status=status.HTTP_200_OK
        )
class FetchAndUpdateHSCodeView(APIView):
    """
    This APIView takes `ASP.NET_SessionId`, `Authorization`, and `tariffCode` as input,
    sends a request to the CRS API, and updates the relevant HSCode with extracted tags.
    """

    def post(self, request, *args, **kwargs):
        # Extract input data from the request
        session_id = request.data.get('sessionId')
        authorization = request.data.get('authorization')
        tariff_code = request.data.get('tariffCode')

        if not session_id or not authorization or not tariff_code:
            return Response(
                {"detail": "Missing required fields: 'ASP.NET_SessionId', 'Authorization', or 'tariffCode'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # API endpoint
        url = f"https://crs.ntsw.ir/api/vas/CRSTS5?tariffCode={tariff_code}"

        # Request headers
        headers = {
            'accept': 'application/json, text/plain, */*',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
            'referer': 'https://crs.ntsw.ir/ts5',
            'cache-control': 'no-cache',
            'pragma': 'no-cache'
        }

        # Cookies
        cookies = {
            "Authorization": authorization,
            "": session_id,
        }

        try:
            # Send a GET request to the external API
            response = requests.get(url, headers=headers, cookies=cookies)

            # Check if the request was successful
            if response.status_code != 200:
                return Response(
                    {
                        "detail": f"Failed to fetch data from the CRS API. Status code: {response.status_code}",
                        "response": response.json(),
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Parse the API response
            response_data = response.json()

            # Extract the tags from the response
            raw_tags = response_data.get("tags", [])
            if not raw_tags:
                return Response(
                    {"detail": "No tags found in the API response."},
                    status=status.HTTP_200_OK,
                )

            # Extract content inside parentheses (e.g., « ... »)
            extracted_tags = [
                re.search(r'«([^»]+)»', tag).group(1)
                for tag in raw_tags if re.search(r'«([^»]+)»', tag)
            ]

            if not extracted_tags:
                return Response(
                    {"detail": "No valid tags found in parentheses."},
                    status=status.HTTP_200_OK,
                )

            # Update or create the HSCode object
            hscode, created = HSCode.objects.get_or_create(code=tariff_code)
            existing_tags = list(hscode.tags.values_list('tag', flat=True))

            # Add new tags to the HSCode object
            for tag_name in extracted_tags:
                if tag_name not in existing_tags:
                    tag, _ = Tag.objects.get_or_create(tag=tag_name)
                    hscode.tags.add(tag)

            hscode.save()

            return Response(
                {
                    "detail": "HSCode updated successfully.",
                    "HSCode": hscode.code,
                    "tags": [tag.tag for tag in hscode.tags.all()],
                },
                status=status.HTTP_200_OK,
            )

        except requests.RequestException as e:
            return Response(
                {"detail": f"An error occurred while communicating with the CRS API: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )