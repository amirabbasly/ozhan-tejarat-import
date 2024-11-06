from django.db import models

def get_default_currency_type():
    return 94

class Performa(models.Model):
    prf_number = models.CharField(max_length=100, default="asd")
    prf_total_price = models.DecimalField(max_digits=10, decimal_places=2, default=1)
    prf_currency_type = models.CharField(max_length=100, default="asd")  # Dynamically assigned default value
    prf_seller_name = models.CharField(max_length=255, default="asd")
    prf_seller_country = models.CharField(max_length=255, default="asd")
    prf_order_no = models.CharField(max_length=100, default="asd")
    prf_status = models.CharField(max_length=50, default="asd")
    prf_date = models.DateField(null=True, blank=True)  # Add the prf_date field
    prf_expire_date = models.DateField(null=True, blank=True)  # Add the prf_expire_date field


class ProformaDetail(models.Model):
    proforma = models.ForeignKey(Performa, related_name='details', on_delete=models.CASCADE)
    prfctm_name = models.CharField(max_length=255)
    prfctm_code = models.CharField(max_length=50)

class ProformaPayment(models.Model):
    proforma = models.ForeignKey(Performa, related_name='payments', on_delete=models.CASCADE)
    payment_date = models.DateTimeField()
    payment_amount = models.DecimalField(max_digits=20, decimal_places=2)
    payment_status = models.CharField(max_length=50)
    payer_name = models.CharField(max_length=255)
    payer_email = models.EmailField()
