
import django_filters
from .models import Cottage

class CottageFilter(django_filters.FilterSet):
    # exact match filters for demonstration; you could also use range filters if needed

    cottage_status = django_filters.Filter(field_name="cottage_status", lookup_expr="exact")
    docs_recieved = django_filters.Filter(field_name="docs_recieved", lookup_expr="exact")
    proforma = django_filters.Filter(field_name="proforma", lookup_expr="exact")


    class Meta:
        model = Cottage
        fields = ["cottage_status","docs_recieved","proforma__prf_order_no"]
