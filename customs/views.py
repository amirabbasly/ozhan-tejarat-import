# hscode/views.py

import pandas as pd
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets, status, filters
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import action
from .models import HSCode, Tag
import requests
from .serializers import HSCodeSerializer, TagSerializer, HSCodeListSerializer
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from .filters import HSCodeFilter  # Import the filter set
import re
from django.utils.timezone import now

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
    search_fields = ["code", "goods_name_fa", "goods_name_en", "tags__tag"]

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
    This APIView takes `sessionId`, `authorization`, and `tariffCode` as input,
    sends a request to the CRS API, and updates the relevant HSCode
    (fields and tags) with data from the API response.
    """

    def post(self, request, *args, **kwargs):
        # Extract input data from the request
        session_id = request.data.get('sessionId')
        authorization = request.data.get('authorization')
        tariff_code = request.data.get('tariffCode')

        if not session_id or not authorization or not tariff_code:
            return Response(
                {
                    "detail": "Missing required fields: 'sessionId', "
                              "'authorization', or 'tariffCode'."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # API endpoint
        url = f"https://crs.ntsw.ir/api/vas/CRSTS5?tariffCode={tariff_code}"

        # Request headers
        headers = {
            'accept': 'application/json, text/plain, */*',
            'user-agent': (
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                'AppleWebKit/537.36 (KHTML, like Gecko) '
                'Chrome/131.0.0.0 Safari/537.36'
            ),
            'referer': 'https://crs.ntsw.ir/ts5',
            'cache-control': 'no-cache',
            'pragma': 'no-cache'
        }

        # Cookies – ensure these match what your API expects
        cookies = {
            "Authorization": authorization,
            "ASP.NET_SessionId": session_id,
        }

        try:
            # Send a GET request to the external API
            response = requests.get(url, headers=headers, cookies=cookies)

            # Check if the request was successful
            if response.status_code != 200:
                return Response(
                    {
                        "detail": (
                            f"Failed to fetch data from the CRS API. "
                            f"Status code: {response.status_code}"
                        ),
                        "response": response.json(),
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            response_data = response.json()

            tariff_data = response_data.get("tariff", {})
            if not tariff_data:
                return Response(
                    {"detail": "No 'tariff' data found in the API response."},
                    status=status.HTTP_200_OK,
                )

            # Get or create the HSCode object by "code"
            # If you never change the code once set, it's safe to match on it
            hscode, created = HSCode.objects.get_or_create(code=tariff_data.get("code", tariff_code))

            # Update fields from the "tariff" data
            # You can always do a safety check before converting to int
            hscode.goods_name_fa = tariff_data.get("persianDescription", hscode.goods_name_fa)
            hscode.goods_name_en = tariff_data.get("englishDescription", hscode.goods_name_en)

            # Suppose you want to store the importDuty in `customs_duty_rate`:
            import_duty = tariff_data.get("importDuty")
            if import_duty is not None:
                try:
                    hscode.customs_duty_rate = int(import_duty)
                except ValueError:
                    pass  # fallback or handle error if needed

            # Suppose `profit` is something else or same as importDuty
            # If you don't have "profit" in the API, you can skip or default it:
            if not hscode.profit:
                hscode.profit = 0  # or some default / or remove it entirely if not relevant

            # commodityPriority -> `priority`
            commodity_priority = tariff_data.get("commodityPriority")
            if commodity_priority is not None:
                try:
                    hscode.priority = int(commodity_priority)
                except ValueError:
                    pass  # fallback or handle error if needed

            # suq -> `SUQ`
            suq_value = tariff_data.get("suq")
            # Make sure suq_value is one of the SUQ_OPTIONS in your model or default to 'U'
            valid_suq_choices = dict(HSCode.SUQ_OPTIONS).keys()  # e.g. ['1000kwh','1000u','2U',...]
            if suq_value in valid_suq_choices:
                hscode.SUQ = suq_value
            else:
                # fallback if the suq_value from the API isn't recognized
                hscode.SUQ = 'U'

             # ------------------------ 2) EXTRACT NEW TAGS ------------------------
            raw_tags = response_data.get("tags", [])
            # We'll collect only the tags inside « ... »
            new_tags = set()  # use a set to avoid duplicates
            for tag_str in raw_tags:
                match = re.search(r'«([^»]+)»', tag_str)
                if match:
                    new_tags.add(match.group(1))

            # new_tags now contains only the extracted strings from « ... ».

            # ------------------------ 3) CLEAR OLD TAGS NOT IN NEW RESPONSE ------------------------
            old_tags = set(hscode.tags.values_list('tag', flat=True))
            tags_to_remove = old_tags - new_tags
            # Remove tags that are no longer present
            if tags_to_remove:
                for tag_text in tags_to_remove:
                    tag_obj = Tag.objects.filter(tag=tag_text).first()
                    if tag_obj:
                        hscode.tags.remove(tag_obj)

            # ------------------------ 4) ADD NEW TAGS THAT DIDN'T EXIST BEFORE ------------------------
            tags_to_add = new_tags - old_tags
            for tag_text in tags_to_add:
                tag_obj, _ = Tag.objects.get_or_create(tag=tag_text)
                hscode.tags.add(tag_obj)
            hscode.updated_by = request.user
            hscode.updated_date = now()
            # ------------------------ SAVE THE HSCode ------------------------
            hscode.save()

            # ------------------------ BUILD RESPONSE ------------------------
            return Response(
                {
                    "detail": "HSCode updated successfully.",
                    "HSCode": hscode.code,
                    "goods_name_fa": hscode.goods_name_fa,
                    "goods_name_en": hscode.goods_name_en,
                    "profit": hscode.profit,
                    "customs_duty_rate": hscode.customs_duty_rate,
                    "priority": hscode.priority,
                    "SUQ": hscode.SUQ,
                    "tags": [t.tag for t in hscode.tags.all()],
                },
                status=status.HTTP_200_OK,
            )

        except requests.RequestException as e:
            return Response(
                {"detail": f"Error while communicating with the CRS API: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class HSCodeListView(APIView):
    def get(self, request):
        # Retrieve all Performa instances
        codes = HSCode.objects.all()
        # Serialize the queryset
        serializer = HSCodeListSerializer(codes, many=True)
        # Return the serialized data
        return Response(serializer.data, status=status.HTTP_200_OK)