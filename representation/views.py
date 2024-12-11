from rest_framework.viewsets import ModelViewSet
from .models import Representation
from .serializers import RepresentationSerializer
from rest_framework.parsers import MultiPartParser, FormParser


class RepresentationViewSet(ModelViewSet):
    queryset = Representation.objects.all()
    serializer_class = RepresentationSerializer
    parser_classes = (MultiPartParser, FormParser)
