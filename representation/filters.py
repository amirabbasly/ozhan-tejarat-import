import datetime

import django_filters
from .models import Representation, Check
from django_filters.filters import DateFromToRangeFilter    
from django.core.exceptions import ValidationError
from datetime import datetime

class RepresentationFilter(django_filters.FilterSet):
    """
    Filter for Representation model.
    """
    representi = django_filters.Filter(field_name="representi__full_name", lookup_expr="exact")

    class Meta:
        model = Representation
        fields = ['representi']

class ChecksFilter(django_filters.FilterSet):
    """
    Filter for Representation model.
    """
    is_paid = django_filters.Filter(field_name="is_paid", lookup_expr="exact")

    class Meta:
        model = Check
        fields = ['is_paid']