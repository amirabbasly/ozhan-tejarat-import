import jdatetime
import datetime

import django_filters
from .models import Cottage
from django_filters.filters import DateFromToRangeFilter
from django.core.exceptions import ValidationError

# utils.py or filters.py
from datetime import datetime
import jdatetime

def jalali_str_to_gregorian_date(jalali_str: str):
    """
    Interpret a string like "1402-05-23" as a Jalali date
    and convert it to a Python (Gregorian) date object.
    """
    if not jalali_str:
        return None

    # Split the string, e.g. "1402-05-23"
    year, month, day = map(int, jalali_str.split("-"))
    # Create a Jalali date object
    jalali_date = jdatetime.date(year, month, day)
    # Convert to standard (Gregorian) date
    return jalali_date.togregorian()  # e.g. datetime.date(2023, 8, 14)

class JalaliFromDateFilter(django_filters.Filter):
    """Filter records where field >= Jalali date."""
    def filter(self, qs, value):
        if not value:
            return qs
        try:
            gregorian_date = jalali_str_to_gregorian_date(value)
            return qs.filter(**{f"{self.field_name}__gte": gregorian_date})
        except (ValueError, ValidationError):
            return qs.none()

class JalaliToDateFilter(django_filters.Filter):
    """Filter records where field <= Jalali date."""
    def filter(self, qs, value):
        if not value:
            return qs
        try:
            gregorian_date = jalali_str_to_gregorian_date(value)
            return qs.filter(**{f"{self.field_name}__lte": gregorian_date})
        except (ValueError, ValidationError):
            return qs.none()
class JalaliDateFromToRangeFilter(DateFromToRangeFilter):
    """
    A custom range filter that uses jdatetime
    to convert ?field_after=1402-05-01 and
    ?field_before=1402-05-31 into Gregorian dates.
    """

    def filter(self, qs, value):
        if value:
            start_date = value.start  # "1402-05-01"
            end_date   = value.stop   # "1402-05-31"

            try:
                if start_date:
                    start_date = jalali_str_to_gregorian_date(start_date)
                if end_date:
                    end_date   = jalali_str_to_gregorian_date(end_date)
            except (ValueError, ValidationError):
                return qs.none()

            # Put them back into a slice so super() can do the __gte / __lte filter
            value = slice(start_date, end_date, None)

        return super().filter(qs, value)
class CottageFilter(django_filters.FilterSet):
    cottage_status = django_filters.Filter(field_name="cottage_status", lookup_expr="exact")
    docs_recieved = django_filters.Filter(field_name="docs_recieved", lookup_expr="exact")
    proforma = django_filters.Filter(field_name="proforma__prf_order_no", lookup_expr="exact")
    cottage_date_after = JalaliFromDateFilter(field_name="cottage_date")
    cottage_date_before = JalaliToDateFilter(field_name="cottage_date")
    class Meta:
        model = Cottage
        fields = ["cottage_status", "docs_recieved", "proforma__prf_order_no", ]



