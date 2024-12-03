from django.db import models
from django_jalali.db import models as jmodels


def get_default_currency_type():
    return 94

class Performa(models.Model):
    prf_order_no = models.CharField(max_length=100, default="asd", unique=True)
    prf_number = models.CharField(max_length=100, unique=True, default="asd")
    prf_total_price = models.DecimalField(max_digits=15, decimal_places=2, default=1)
    prf_currency_type = models.CharField(max_length=100, default="asd")  # Consider using a ForeignKey for currency types
    prf_seller_name = models.CharField(max_length=255, default="asd")
    prf_seller_country = models.CharField(max_length=255, default="asd")
    prf_status = models.CharField(max_length=50, default="asd")
    prf_date = jmodels.jDateField(null=True, blank=True)  # Changed to DateTimeField for precise timestamps
    prf_expire_date = jmodels.jDateField(null=True, blank=True)  # Changed to DateTimeField
    prfVCodeInt = models.CharField(max_length=50, unique=True)  # Assuming this is a unique identifier


    def __str__(self):
        return self.prf_order_no
