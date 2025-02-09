from django.conf import settings
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from PIL import Image, ImageDraw, ImageFont
import io
from .serializers import OverlayTextSerializer, ImageTemplateSerializer, FillExcelSerializer
from .models import ImageTemplate
import os
import openpyxl

class FillExcelTemplateView(APIView):
    """
    POST:
    Receives 'name', 'date', and 'amount' to fill in an Excel template.
    Returns a downloadable Excel file.
    """

    def post(self, request, format=None):
        serializer = FillExcelSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        name = data['name']
        date_value = data['date']         # this is a Python date object
        amount_value = data['amount']     # this is a Decimal

        # 1. Load the Excel template
        template_path = 'static/excel_template/INV.xlsx'
        wb = openpyxl.load_workbook(template_path)
        sheet = wb.active  # or wb["SheetName"] if you have a named sheet

        # 2. Fill in the required cells
        # Let's place them in A2, B2, C2 as an example
        sheet['I15'] = name
        sheet['K15'] = date_value.strftime('%Y-%m-%d')  # convert date to string
        sheet['J20'] = float(amount_value)              # convert Decimal to float

        # 3. Build the response
        response = HttpResponse(
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = 'attachment; filename="filled_template.xlsx"'

        # 4. Save the workbook to the response
        wb.save(response)

        return response
class OverlayTextView(APIView):
    def post(self, request):
        # 1) Fetch the template based on template_id
        try:
            template_id = request.data.get('template_id')
            template = ImageTemplate.objects.get(id=template_id)
        except ImageTemplate.DoesNotExist:
            return Response({"error": "Template not found."},
                            status=status.HTTP_404_NOT_FOUND)

        # 2) Validate incoming data
        serializer = OverlayTextSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)

        # 3) Extract validated fields
        exporter = serializer.validated_data['exporter']
        consignee = serializer.validated_data['consignee']
        means_of_transport = serializer.validated_data['means_of_transport']
        goods = serializer.validated_data['goods']  # List of dictionaries

        # 4) Load the template image and prepare for drawing
        img = Image.open(template.template_image.path)
        draw = ImageDraw.Draw(img)
        font_path = os.path.join(settings.BASE_DIR, 'static', 'fonts', 'arial.ttf')
        font_size = template.font_size                # <--- Read from the model
        font = ImageFont.truetype(font_path, font_size)

        # 5) Draw static fields using multiline_text to preserve line breaks
        # Positions are stored as "x,y" strings in your model.
        exporter_x, exporter_y = map(int, template.exporter_position.split(','))
        consignee_x, consignee_y = map(int, template.consignee_position.split(','))
        transport_x, transport_y = map(int, template.means_of_transport_position.split(','))

        draw.multiline_text((exporter_x, exporter_y), exporter, fill="black", font=font)
        draw.multiline_text((consignee_x, consignee_y), consignee, fill="black", font=font)
        draw.multiline_text((transport_x, transport_y), means_of_transport, fill="black", font=font)

        # 6) Get the X-axis positions for each goods column.
        #    In your model, these fields hold a single integer (as a string).
        #    Additionally, we define an X coordinate for the index column.
        description_x = int(template.description_position)       # e.g., "100"
        hscode_x = int(template.hscode_position)                 # e.g., "300"
        quantity_x = int(template.quantity_position)             # e.g., "500"
        invoices_x = int(template.number_of_invoices_position)     # e.g., "700"

        # 7) Get the start position and line height for listing goods.
        #    goods_start_position is expected to be a string like "100,300" (x,y).
        goods_start_x, goods_start_y = map(int, template.goods_start_position.split(','))
        current_y = goods_start_y
        line_height = template.goods_line_height  # Vertical spacing between each row
        index_x = goods_start_x  
        # 8) Draw each good in its own row.
        #    Include an index column (using good['index'] if provided, or falling back to the loop index).
        for i, good in enumerate(goods, start=1):
            index_value = good.get('index', i)
            description_text = good.get('description', '')
            hscode_text = good.get('hscode', '')
            quantity_text = good.get('quantity', '')
            invoices_text = good.get('number_of_invoices', '')

            # Draw each field at its respective X position and the current Y position.
            draw.multiline_text((index_x,       current_y), str(index_value), fill="black", font=font)
            draw.multiline_text((description_x, current_y), description_text, fill="black", font=font)
            draw.multiline_text((hscode_x,      current_y), hscode_text, fill="black", font=font)
            draw.multiline_text((quantity_x,    current_y), quantity_text, fill="black", font=font)
            draw.multiline_text((invoices_x,    current_y), invoices_text, fill="black", font=font)

            # Move down to the next row.
            current_y += line_height

        # 9) Save the modified image to a BytesIO object and return it.
        img_io = io.BytesIO()
        img.save(img_io, format="JPEG")
        img_io.seek(0)

        return HttpResponse(img_io.getvalue(), content_type="image/jpeg")
class TemplateListView(APIView):    
    def get(self, request):
        # Get all templates from the database
        templates = ImageTemplate.objects.all()
        serializer = ImageTemplateSerializer(templates, many=True)
        return Response(serializer.data)