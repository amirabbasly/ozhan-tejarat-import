# hscode/views.py

import pandas as pd
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets, status, filters
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import action
from .models import HSCode, Tag, Season, Heading, Commercial
import requests
from .serializers import HSCodeSerializer, TagSerializer, HSCodeListSerializer, HSCodeDetailSerializer
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from .filters import HSCodeFilter  # Import the filter set
import re
from django.utils.timezone import now
from django.db import transaction

class CustomPageNumberPagination(PageNumberPagination):
    page_size_query_param = 'page_size'
    max_page_size = 600
class HSCodeDetailByCodeView(APIView):
    """
    Retrieve HSCode details by providing its code.
    The code should be provided as a query parameter, e.g.:
      /api/hscode-detail/?code=0101212345
    """

    def get(self, request, *args, **kwargs):
        # Get the "code" query parameter
        code = request.query_params.get('code', None)
        if not code:
            return Response(
                {"detail": "No HSCode code provided in the query parameters."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Retrieve the HSCode object by its code.
            hscode = HSCode.objects.get(code=code)
        except HSCode.DoesNotExist:
            return Response(
                {"detail": f"HSCode with code '{code}' not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Serialize the found HSCode
        serializer = HSCodeDetailSerializer(hscode)
        return Response(serializer.data, status=status.HTTP_200_OK)

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

        # Force columns to be read as strings if needed (e.g., to preserve leading zeros)
        df = pd.read_excel(
            excel_file,
            dtype={
                "TableNumberFix": str,  # Preserve leading zeros in the code
                # Add additional columns if needed.
            }
        )

        for _, row in df.iterrows():
            code = row.get('TableNumberFix', '')
            if not code:
                continue

            # Extract season and heading parts from the code
            season_code = code[:2]    # first 2 digits for season
            heading_code = code[:4]   # first 4 digits for heading

            # Look up the corresponding Season instance.
            # Adjust the field name in the filter (e.g., 'code') as per your Season model.
            season = Season.objects.filter(code=season_code).first()
            if season is None:
                # You might want to either create a new Season, skip this row,
                # or raise an error. Here, we simply continue to the next row.
                continue

            # Look up the corresponding Heading instance.
            # Adjust the field name (e.g., 'code') according to your Heading model.
            heading = Heading.objects.filter(code=heading_code).first()
            # It is possible that the heading isn't found. In that case,
            # you can decide to skip or leave heading as None.
            
            # Perform the update_or_create.
            # Add additional fields according to your model.
            HSCode.objects.update_or_create(
                code=code,
                defaults={
                    "goods_name_en": row.get('TableKalaNameEN', ''),
                    "goods_name_fa": row.get('TableKalaName', ''),
                    "profit": row.get('TableCommercialbenefit', 0),
                    "SUQ": row.get('TableSUQ', ''),
                    "priority": row.get('commodityPriority', None),
                    "customs_duty_rate": row.get('TableVorodi', None),
                    "season": season,
                    "heading": heading,
                }
            )

        return Response(
            {"detail": "HSCode Excel imported successfully."},
            status=status.HTTP_200_OK
        )
class FetchAndUpdateHSCodeView(APIView):
    def post(self, request, *args, **kwargs):
        # 1. Extract basic data
        session_id = request.data.get("sessionId")
        authorization = request.data.get("authorization")
        tariff_code = request.data.get("tariffCode")

        if not session_id or not authorization or not tariff_code:
            return Response(
                {"detail": "Missing required fields: 'sessionId', 'authorization', or 'tariffCode'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 2. API call setup
        url = f"https://crs.ntsw.ir/api/vas/CRSTS5?tariffCode={tariff_code}"
        headers = {
            "accept": "application/json, text/plain, */*",
            "user-agent": "Mozilla/5.0",
            "referer": "https://crs.ntsw.ir/ts5",
            "cache-control": "no-cache",
            "pragma": "no-cache",
        }
        cookies = {"Authorization": authorization, "ASP.NET_SessionId": session_id}

        try:
            # 3. Fetch the CRS data
            response = requests.get(url, headers=headers, cookies=cookies)
            if response.status_code != 200:
                return Response(
                    {
                        "detail": f"Failed to fetch data from the CRS API. Status code: {response.status_code}",
                        "response": response.json(),
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            response_data = response.json()
            tariff_data = response_data.get("tariff", {})
            if not tariff_data:
                return Response({"detail": "No 'tariff' data found."}, status=status.HTTP_200_OK)

            # 4. Get or create HSCode
            hscode, created = HSCode.objects.get_or_create(code=tariff_data.get("code", tariff_code))

            # 5. Update HSCode fields
            hscode.goods_name_fa = tariff_data.get("persianDescription", hscode.goods_name_fa)
            hscode.goods_name_en = tariff_data.get("englishDescription", hscode.goods_name_en)
            import_duty = tariff_data.get("importDuty", hscode.import_duty_rate)

            if import_duty is not None:
                try:
                    hscode.import_duty_rate = int(import_duty)
                except ValueError:
                    pass
            commodity_priority = tariff_data.get("commodityPriority")
            if commodity_priority is not None:
                try:
                    hscode.priority = int(commodity_priority)
                except ValueError:
                    pass

            suq_value = tariff_data.get("suq")
            if suq_value:
                hscode.SUQ = suq_value  # Validate if needed

            if hscode.profit is None:
                hscode.profit = 0

            # ----------------------------------------------------------------------
            # 6. Handle tags with 3 rules:
            #    1) angled quotes => inside is 'tag', outside is 'title'
            #    2) dash or underscore => left is 'title', right is 'tag'
            #    3) otherwise => entire string in 'tag', empty title
            # ----------------------------------------------------------------------
            raw_tags = response_data.get("tags", [])
            new_tag_pairs = []

            for tag_str in raw_tags:
                tag_str = tag_str.strip()

                # Rule (1) angled quotes:
                match_angled = re.search(r'«([^»]+)»', tag_str)
                if match_angled:
                    # The text inside angled quotes => tag
                    tag_val = match_angled.group(1).strip()
                    # Remove angled part to get the outside => title
                    title_val = re.sub(r'«[^»]+»', '', tag_str).strip()

                else:
                    # Rule (2) dash or underscore
                    if '-' in tag_str:
                        left, right = tag_str.split('-', 1)
                        title_val = left.strip()
                        tag_val = right.strip()

                    elif '_' in tag_str:
                        left, right = tag_str.split('_', 1)
                        title_val = left.strip()
                        tag_val = right.strip()

                    else:
                        # Rule (3) entire string is 'tag'
                        title_val = ""
                        tag_val = tag_str

                new_tag_pairs.append((title_val, tag_val))

            # Remove old tags not in the new set
            # (we identify uniqueness by 'tag', ignoring 'title')
            new_tags_set = {pair[1] for pair in new_tag_pairs}
            old_tags_set = set(hscode.tags.values_list("tag", flat=True))
            tags_to_remove = old_tags_set - new_tags_set
            for tag_text in tags_to_remove:
                tag_obj = Tag.objects.filter(tag=tag_text).first()
                if tag_obj:
                    hscode.tags.remove(tag_obj)

            # Add or create new Tag objects
            for title_val, tag_val in new_tag_pairs:
                tag_obj, _ = Tag.objects.get_or_create(
                    tag=tag_val,
                    defaults={"title": title_val}
                )
                # Optionally update the title each time, in case it changed
                tag_obj.title = title_val
                tag_obj.save()

                hscode.tags.add(tag_obj)

            # 7. Parse "tS5RuleResult" and update Commercial
            tS5_results = response_data.get("tS5RuleResult", [])
            new_commercial_objs = []
            for rule in tS5_results:
                rule_id = rule.get("ruleId", "")
                rule_title = rule.get("ruleTitle", "")
                result_str = rule.get("result", "")
                conditions_list = rule.get("conditions", [])

                # Combine multiple conditions into one string if needed
                conditions_joined = " | ".join(conditions_list)

                # Get or create a Commercial entry (if you have a rule_id field)
                commercial_obj, _ = Commercial.objects.get_or_create(
                    rule_id=rule_id,
                    defaults={
                        "title": rule_title,
                        "condition": conditions_joined,
                        "result": result_str,
                    },
                )
                # If not created, optionally update existing
                commercial_obj.title = rule_title
                commercial_obj.condition = conditions_joined
                commercial_obj.result = result_str
                commercial_obj.save()

                new_commercial_objs.append(commercial_obj)

            # REPLACE existing commercials with the new ones (if that's desired)
            hscode.commercials.set(new_commercial_objs)

            # 8. Save
            hscode.updated_by = request.user
            hscode.updated_date = now()
            hscode.save()

            # 9. Response
            return Response(
                {
                    "detail": "HSCode updated successfully.",
                    "HSCode": hscode.code,
                    "goods_name_fa": hscode.goods_name_fa,
                    "goods_name_en": hscode.goods_name_en,
                    "commercials": [
                        {
                            "id": c.id,
                            "rule_id": getattr(c, "rule_id", None),
                            "title": c.title,
                            "condition": c.condition,
                            "result": c.result,
                        }
                        for c in hscode.commercials.all()
                    ],
                    "tags": [
                        {"id": t.id, "title": t.title, "tag": t.tag}
                        for t in hscode.tags.all()
                    ],
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
class ImportHeadingsView(APIView):
    """
    API endpoint to import Heading records from an Excel file.
    """

    def post(self, request, *args, **kwargs):
        # Check if a file is provided
        file = request.FILES.get('file')
        if not file:
            return Response({"error": "No file provided."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Load the Excel file into a DataFrame
            df = pd.read_excel(file)

            # Check for required columns
            if 'code' not in df.columns or 'description' not in df.columns:
                return Response({"error": "The file must contain 'code' and 'description' columns."}, status=status.HTTP_400_BAD_REQUEST)

            headings_to_create = []

            with transaction.atomic():
                for _, row in df.iterrows():
                    code = str(row['code']).zfill(4)  # Ensure the code is a 4-character string
                    description = row['description']

                    # Extract the first two digits of the code to find the season
                    season_code = code[:2]
                    season = Season.objects.filter(code=season_code).first()
                    if not season:
                        return Response({"error": f"No Season found with code {season_code}."}, status=status.HTTP_400_BAD_REQUEST)

                    # Create Heading instance
                    headings_to_create.append(
                        Heading(
                            code=code,
                            season=season,
                            description=description
                        )
                    )

                # Bulk create all Heading instances
                Heading.objects.bulk_create(headings_to_create)

            return Response({"message": "Headings imported successfully."}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class ImportSeasonsView(APIView):
    """
    API endpoint to import Season records from an Excel file.
    """

    def post(self, request, *args, **kwargs):
        # Check if a file is provided
        file = request.FILES.get('file')
        if not file:
            return Response({"error": "No file provided."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Load the Excel file into a DataFrame
            df = pd.read_excel(file)

            # Check for required columns
            if 'code' not in df.columns or 'description' not in df.columns:
                return Response({"error": "The file must contain 'code' and 'description' columns."}, status=status.HTTP_400_BAD_REQUEST)

            seasons_to_create = []

            with transaction.atomic():
                for _, row in df.iterrows():
                    code = str(row['code']).zfill(2)  # Ensure the code is a 2-character string
                    description = row['description']

                    # Create Season instance
                    seasons_to_create.append(
                        Season(
                            code=code,
                            description=description
                        )
                    )

                # Bulk create all Season instances
                Season.objects.bulk_create(seasons_to_create)

            return Response({"message": "Seasons imported successfully."}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
