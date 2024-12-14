from rest_framework.viewsets import ModelViewSet
from .models import Representation, Check
from .serializers import RepresentationSerializer, CheckSerializer
from rest_framework.parsers import MultiPartParser, FormParser


class RepresentationViewSet(ModelViewSet):
    queryset = Representation.objects.all()
    serializer_class = RepresentationSerializer
    parser_classes = (MultiPartParser, FormParser)

class CheckViewSet(ModelViewSet):
    queryset = Check.objects.all()
    serializer_class = CheckSerializer
    