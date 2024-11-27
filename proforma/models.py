from django.db import models

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
    prf_date = models.DateTimeField(null=True, blank=True)  # Changed to DateTimeField for precise timestamps
    prf_expire_date = models.DateTimeField(null=True, blank=True)  # Changed to DateTimeField
    prfVCodeInt = models.CharField(max_length=50, unique=True)  # Assuming this is a unique identifier


    def __str__(self):
        return self.prf_order_no

class ProformaDetail(models.Model):
    performa = models.ForeignKey(Performa, related_name='details', on_delete=models.CASCADE,)
    prfctm_name = models.CharField(max_length=255)
    prfctm_code = models.CharField(max_length=50)
    prfcntVCodeStr = models.CharField(max_length=50, default="abcd")


    def __str__(self):
        return f"{self.prfctm_name} ({self.prfctm_code})"

class ProformaPayment(models.Model):
    proforma = models.ForeignKey(Performa, related_name='payments', on_delete=models.CASCADE)
    payment_date = models.DateTimeField()
    payment_amount = models.DecimalField(max_digits=20, decimal_places=2)
    payment_status = models.CharField(max_length=50, null=True, blank=True)
    payer_name = models.CharField(max_length=255, null=True, blank=True)
    payer_email = models.EmailField(null=True, blank=True)

    def __str__(self):
        return f"Payment of {self.payment_amount} by {self.payer_name}"
# proforma/models.py

class RequestStatus(models.Model):
    performa = models.ForeignKey(Performa, related_name='request_statuses', on_delete=models.CASCADE)
    pfg_vcode_lng = models.CharField(max_length=50)
    gds_hs_code = models.CharField(max_length=50)
    pfg_commercial_desc_str = models.TextField()
    pgp_send_status_tny = models.CharField(max_length=100)
    pfg_status_criteria_inquiry = models.TextField(null=True, blank=True)
    pfg_status_result_request_sabtaresh = models.TextField(null=True, blank=True)
    pgp_description_str = models.TextField(null=True, blank=True)
    agn_name_str = models.CharField(max_length=255)
    agn_vcode_int = models.BigIntegerField()
    fld_desc_str = models.TextField(null=True, blank=True)  # Serialized list of descriptions

    def __str__(self):
        return f"RequestStatus {self.pfg_vcode_lng} for {self.performa.prf_number}"