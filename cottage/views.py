from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Cottage
from .serializers import CottageSerializer

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