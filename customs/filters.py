
import django_filters
from .models import HSCode

class HSCodeFilter(django_filters.FilterSet):
    # exact match filters for demonstration; you could also use range filters if needed
    profit = django_filters.NumberFilter(field_name="profit", lookup_expr="exact")
    priority = django_filters.NumberFilter(field_name="priority", lookup_expr="exact")
    customs_duty_rate = django_filters.NumberFilter(field_name="customs_duty_rate", lookup_expr="exact")
    suq = django_filters.Filter(field_name="SUQ", lookup_expr="exact")

    class Meta:
        model = HSCode
        fields = ["profit", "priority", "customs_duty_rate","suq"]
