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
import xlsxwriter
from reportlab.lib.pagesizes import letter

class FillInvoiceView(APIView):
    def post(self, request, format=None):
        # Deserialize the request data
        serializer = FillExcelSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        invoice_number = data['invoice_number']
        date_value = data['date']
        amount_value = data['amount']
        goods = data['goods']  # List of goods from the request

        # Check if the goods list is empty or missing
        if not goods:
            return Response({"error": "Goods list cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Load the Excel template
        template_path = 'static/excel_template/INV.xlsx'
        wb = openpyxl.load_workbook(template_path)
        sheet = wb.active

        # 2. Fill in the required fields for the invoice
        sheet['A2'] = invoice_number
        sheet['A4'] = f"Invoice date: {date_value.strftime('%Y-%m-%d')}"
        sheet['H13'] = float(amount_value)  # Total amount
        # 3. Fill the goods table starting from row 20
        starting_row = 20
        for i, good in enumerate(goods):
            row = starting_row + i  # Place each good in the next row

            # Insert a new row if necessary (only after the first row)
            if i > 0:
                sheet.insert_rows(row)  # Insert a new row at the current position
                
                # Move the content below the inserted row down by 1 row
                for r in range(sheet.max_row, row, -1):  # Start from the last row and go upwards
                    for col in range(1, sheet.max_column + 1):  # Adjust the range to match your columns
                        source_cell = sheet.cell(row=r-1, column=col)  # Copy from the row above
                        target_cell = sheet.cell(row=r, column=col)
                        
                        # Check if the source cell is part of a merged cell range
                        is_merged = False
                        for merged in sheet.merged_cells.ranges:
                            if source_cell.coordinate in merged:
                                is_merged = True
                                first_cell = sheet.cell(row=merged.min_row, column=merged.min_col)
                                target_cell._value = first_cell._value  # Copy value from the first merged cell
                                target_cell._style = first_cell._style  # Copy style from the first merged cell
                                break
                        
                        if not is_merged:
                            target_cell._value = source_cell._value  # Copy value for non-merged cells
                            target_cell._style = source_cell._style  # Copy style for non-merged cells

            # Ensure the good contains all necessary data (you can add further checks here if needed)
            required_keys = ['name', 'country_of_origin', 'commodity_code', 'gw', 'nw', 'quantity', 'unit', 'unit_price']
            for key in required_keys:
                if key not in good:
                    return Response({"error": f"Missing {key} for good {i + 1}"}, status=status.HTTP_400_BAD_REQUEST)

            # Fill each column with data for this good
            sheet[f'K{row}'] = i + 1  # Index number
            sheet[f'I{row}'] = good['name']  # Goods name
            sheet[f'H{row}'] = good['country_of_origin']  # Country of origin
            sheet[f'G{row}'] = good['commodity_code']  # Commodity code
            sheet[f'F{row}'] = good['gw']  # Gross weight
            sheet[f'E{row}'] = good['nw']  # Net weight
            sheet[f'D{row}'] = good['quantity']  # Quantity
            sheet[f'C{row}'] = good['unit']  # Unit
            sheet[f'B{row}'] = good['unit_price']  # Unit price
            sheet[f'A{row}'] = good['quantity'] * good['unit_price']  # Total amount (calculated)



        # 4. Build the response with the filled Excel file
        response = HttpResponse(
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = 'attachment; filename="filled_template.xlsx"'

        # Save the workbook to the response
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