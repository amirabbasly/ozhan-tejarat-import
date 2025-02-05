from django.conf import settings
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from PIL import Image, ImageDraw, ImageFont
import io
from .serializers import OverlayTextSerializer
from .models import ImageTemplate

class OverlayTextView(APIView):
    def post(self, request):
        # Get the template from the database (assuming you have one default template)
        try:
            template = ImageTemplate.objects.first()  # Or filter by name if you have multiple templates
        except ImageTemplate.DoesNotExist:
            return Response({"error": "Template not found."}, status=status.HTTP_404_NOT_FOUND)

        # Validate the data using the serializer
        serializer = OverlayTextSerializer(data=request.data)
        if serializer.is_valid():
            exporter = serializer.validated_data['exporter']
            consignee = serializer.validated_data['consignee']
            quantity = serializer.validated_data['quantity']
            description = serializer.validated_data['description']

            # Load the template image from the model
            template_image_path = template.template_image.path
            img = Image.open(template_image_path)

            # Define the drawing context and font
            draw = ImageDraw.Draw(img)
            font = ImageFont.load_default()

            # Parse the text positions from the model (convert the string to a tuple of integers)
            exporter_pos = tuple(map(int, template.exporter_position.split(',')))
            consignee_pos = tuple(map(int, template.consignee_position.split(',')))
            quantity_pos = tuple(map(int, template.quantity_position.split(',')))
            description_pos = tuple(map(int, template.description_position.split(',')))

            # Add the text to the image based on positions from the model
            draw.text(exporter_pos, exporter, fill="black", font=font)
            draw.text(consignee_pos, consignee, fill="black", font=font)
            draw.text(quantity_pos, quantity, fill="black", font=font)
            draw.text(description_pos, description, fill="black", font=font)

            # Save the modified image to a BytesIO object
            img_io = io.BytesIO()
            img.save(img_io, format="JPEG")
            img_io.seek(0)

            # Return the image as a HttpResponse
            return HttpResponse(img_io.getvalue(), content_type="image/jpeg")

        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
