from django.conf import settings
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from PIL import Image, ImageDraw, ImageFont
import io
from .serializers import OverlayTextSerializer, ImageTemplateSerializer, FillExcelSerializer,  SellerSerializer, BuyerSerializer, InvoiceSerializer
from .models import ImageTemplate, Seller, Buyer, Invoice
import os
import openpyxl
import xlsxwriter
from reportlab.lib.pagesizes import letter
from rest_framework import viewsets
from rest_framework.pagination import PageNumberPagination
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
)
from reportlab.graphics.shapes import Drawing, Line

from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

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

class SellerViewSet(viewsets.ModelViewSet):
    queryset = Seller.objects.all()
    serializer_class = SellerSerializer
    pagination_class = None  # Disable pagination here


class BuyerViewSet(viewsets.ModelViewSet):
    queryset = Buyer.objects.all()
    serializer_class = BuyerSerializer
    pagination_class = None  # Disable pagination here



class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
class InvoicePDFView(APIView):
    """
    Returns a PDF with the invoice number and date on the right side,
    and other sections laid out as per the template.
    """
    def get(self, request, pk, format=None):
        try:
            invoice = Invoice.objects.get(pk=pk)
        except Invoice.DoesNotExist:
            return Response({"detail": "Invoice not found."}, status=status.HTTP_404_NOT_FOUND)

        # Register the Broadway font
        pdfmetrics.registerFont(TTFont('Broadway', 'static/fonts/broadway.ttf'))

        # 1) Create the HttpResponse for the PDF
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="invoice_{pk}.pdf"'

        # Set up the SimpleDocTemplate with custom margins (left, right, top, bottom)
        doc = SimpleDocTemplate(
            response,
            pagesize=A4,
            title=f"Invoice {invoice.invoice_number}",
            author="Your Company",
            leftMargin=0.5 * inch,   # Set left margin to 0.5 inch
            rightMargin=0.5 * inch,  # Set right margin to 0.5 inch
            topMargin=0.2 * inch,    # Set top margin to 0.5 inch
            bottomMargin=0.5 * inch  # Set bottom margin to 0.5 inch
        )


        # 3) Get default styles and add a custom style for right alignment
        styles = getSampleStyleSheet()

        # Custom Style for the word "INVOICE" (Red, Broadway font, large size)
        styles.add(ParagraphStyle(
            name="InvoiceTitle",
            fontSize=24,
            textColor=colors.black,
            alignment=1,  # 2 = center
            spaceAfter=0
        ))

        # Custom Style for seller's name (Red and Broadway Font)
        styles.add(ParagraphStyle(
            name="SellerName",
            fontName="Broadway",
            fontSize=26,
            textColor=colors.red,
            alignment=1,  # Align left
            spaceAfter=20,
        ))

        # Custom Style for right alignment (Invoice Number and Date)
        styles.add(ParagraphStyle(
            name="RightAlign",
            parent=styles["Normal"],
            alignment=2,  # 2 = right align
            fontSize=12,
            textColor=colors.black,
            spaceAfter=10,
        ))
                # Custom Style for right alignment (Invoice Number and Date)
        styles.add(ParagraphStyle(
            name="LeftAlign",
            parent=styles["Normal"],
            alignment=0,  # 2 = right align
            fontSize=9,
            textColor=colors.black,
            spaceAfter=-50,
        ))

        # Story list to hold content
        story = []
        # Create a drawing container with the full width of the page, ignoring margins
        drawing = Drawing(doc.pagesize[0] + doc.leftMargin + doc.rightMargin, 0.1 * inch)  # Full width, height of 0.1 inch for the line
        line = Line(-doc.leftMargin, 0, doc.pagesize[0] + doc.rightMargin, 0)  # Line from left (ignoring left margin) to right (ignoring right margin)
        drawing.add(line)  # Add the line to the drawing
        # ===================================================================
        # 6) Seller Info Section
        seller_name = f"{invoice.seller.seller_name}"
        story.append(Paragraph(seller_name, styles["SellerName"]))
        # ===================================================================
        # 4) Add the word "INVOICE" (Centered and Red)
        invoice_title = "INVOICE"
        story.append(Paragraph(invoice_title, styles["InvoiceTitle"]))

        # ===================================================================
        # 5) Invoice Info (Right-aligned - Invoice Number and Date)
        invoice_info = f"""
        invoice number: {invoice.invoice_number}<br/>
        invoice date: {invoice.invoice_date}
        """
        story.append(Paragraph(invoice_info, styles["LeftAlign"]))
        story.append(Spacer(1, 0.5 * inch))

        # Add a separator line


        # Seller Address, Country, Reference
        seller_info = f"""
        <b>Seller name and address:</b><br/>  {invoice.seller.seller_name}<br/>  {invoice.seller.seller_address}<br/>
        Country of beneficiary: {invoice.seller.seller_country}<br/>
        Seller's reference: {invoice.seller.seller_refrence}
        """

        # ===================================================================
        # 8) Buyer Info Section
        buyer_info = f"""
        <b>Buyer’s Commercial Card No:</b> {invoice.buyer.buyer_card_number}<br/>
        Buyer’s Name: {invoice.buyer.buyer_name}<br/>
        Buyer’s Country: {invoice.buyer.buyer_country}
        """
        table_data = [
            [Paragraph(seller_info), Paragraph(buyer_info)]
        ]
        
        # Table for invoiceTitle and sellerName side by side
        table = Table(table_data, colWidths=[3.6 * inch, 3.6 * inch])  # Adjust the widths as needed
        table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (0, 0), 'CENTER'),
            ('ALIGN', (1, 0), (1, 0), 'LEFT'),
            ('VALIGN', (0, 0), (1, 0), 'TOP'),
            ('FONTNAME', (0, 0), (1, 0), 'Broadway'),
        ]))
        story.append(Paragraph("Seller and Buyer Info", styles["LeftAlign"]))
        story.append(drawing)

        
        story.append(table)
        story.append(Spacer(0.5, 0.5 * inch))  # Add space before table
        story.append(Paragraph("Shipping Info", styles["LeftAlign"]))

        # Add the drawing (which contains the line) as a flowable
        story.append(drawing)



        table_data = [["No", "Item Description", "Item Description"]]  # headers

        # Adding item descriptions as Paragraphs to allow text wrapping
        for idx, item in enumerate(invoice.items.all(), 1):
            # Wrap the item description in a Paragraph for automatic line breaks
            item_description = Paragraph(item.description, styles["Normal"])  # use styles["Normal"] or your custom style
            table_data.append([str(idx), item_description, ""])

        # Create the table
        table = Table(table_data, colWidths=[0.5 * inch, 4 * inch, 4 * inch])  # Adjust column widths
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),  # Header background
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),  # Header text color
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),  # Center-align all text
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),  # Header font
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),  # Bottom padding for headers
            ('BACKGROUND', (0, 1), (-1, -1), colors.white),  # Background for body rows
            ('GRID', (0, 0), (-1, -1), 1, colors.black),  # Grid lines
        ]))

        # Add the table to the story
        story.append(Spacer(1, 0.5 * inch))  # Add space before table
        story.append(table)
        # ===================================================================
        # 11) Finalize the PDF
        doc.build(story)

        return response

class InvoiceExcelView(APIView):
    """
    Returns an Excel file (XLSX) for the given Invoice (by primary key).
    """
    def get(self, request, pk, format=None):
        try:
            invoice = Invoice.objects.get(pk=pk)
        except Invoice.DoesNotExist:
            return Response({"detail": "Invoice not found."}, status=status.HTTP_404_NOT_FOUND)

        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Invoice"

        # Write headers
        ws["A1"] = "Invoice ID"
        ws["B1"] = "Invoice Number"
        ws["C1"] = "Seller"
        ws["D1"] = "Buyer"
        ws["E1"] = "Total Amount"
        ws["F1"] = "Freight Charges"
        ws["G1"] = "Currency"
        ws["H1"] = "Invoice Date"

        # Write the invoice info
        ws["A2"] = invoice.invoice_id
        ws["B2"] = invoice.invoice_number
        ws["C2"] = invoice.seller.seller_account_name
        ws["D2"] = invoice.buyer.buyer_card_number
        ws["E2"] = float(invoice.total_amount)
        ws["F2"] = invoice.freight_charges
        ws["G2"] = invoice.invoice_currency
        ws["H2"] = str(invoice.invoice_date)

        # Optionally create a new sheet for items
        item_sheet = wb.create_sheet("Items")
        item_sheet["A1"] = "Description"
        item_sheet["B1"] = "Quantity"
        item_sheet["C1"] = "Unit Price"
        item_sheet["D1"] = "Line Total"

        row = 2
        for item in invoice.items.all():
            item_sheet[f"A{row}"] = item.description
            item_sheet[f"B{row}"] = item.quantity
            item_sheet[f"C{row}"] = float(item.unit_price)
            item_sheet[f"D{row}"] = float(item.line_total)
            row += 1

        # Prepare response with XLSX data
        response = HttpResponse(
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
        response['Content-Disposition'] = f'attachment; filename="invoice_{pk}.xlsx"'

        wb.save(response)
        return response