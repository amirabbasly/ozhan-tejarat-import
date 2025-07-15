from django.db import models, transaction
from django_jalali.db import models as jmodels
from decimal import Decimal




def get_default_currency_type():
    return 94

class Performa(models.Model):
    prf_order_no = models.CharField(max_length=100, null=True,blank=True, unique=True)
    prf_number = models.CharField(max_length=100, unique=True, default="asd")
    prf_freight_price = models.DecimalField(max_digits=20, decimal_places=2, default=1)
    FOB = models.DecimalField(max_digits=20, decimal_places=2, default=1)
    prf_total_price = models.DecimalField(max_digits=20, decimal_places=2, default=1)
    prf_currency_type = models.CharField(max_length=100, default="asd")
    prf_currency_price = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True)
    prf_seller_country = models.CharField(max_length=255, default="asd")
    prf_status = models.CharField(max_length=50, default="asd")
    prf_date = jmodels.jDateField(null=True, blank=True)
    prf_expire_date = jmodels.jDateField(null=True, blank=True)
    prfVCodeInt = models.CharField(max_length=50, unique=True,)
    booked_amount = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    remaining_total = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    remaining_freight_charges = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    registrant = models.CharField(max_length=100)
    goods_type = models.CharField(max_length=100, null=True, blank=True)
    payment_instrument = models.CharField(max_length=100, null=True, blank=True)
    bank_info = models.CharField(max_length=255, null=True, blank=True)
    purchased_total = models.IntegerField(max_length=30, null=True, blank=True)
    rial_deposit = models.BigIntegerField(max_length=50, null=True, blank=True)



    def save(self, *args, **kwargs):
        if self.pk:
            old_prf_currency_price = (
                Performa.objects.filter(pk=self.pk)
                .values_list('prf_currency_price', flat=True)
                .first()
            )
        else:
            old_prf_currency_price = None

        if not self.pk:
            # If creating a new Performa, remaining_total is prf_total_price
            self.remaining_total = self.prf_total_price
            self.remaining_freight_charges = self.prf_freight_price
        else:
            # Recalculate remaining_total based on related Cottages
            total_allocated = self.cottages.aggregate(
                total=models.Sum('total_value')
            )['total'] or Decimal('0.00')
            freight_allocated = self.invoices.aggregate(
                total=models.Sum('freight_charges')
            )['total'] or Decimal('0.00')
            self.remaining_total = self.prf_total_price - total_allocated
            self.remaining_freight_charges = self.prf_freight_price - freight_allocated
        super().save(*args, **kwargs)
        new_prf_currency_price = self.prf_currency_price
        if old_prf_currency_price != new_prf_currency_price:
            self._update_related_cottages_currency(new_prf_currency_price)
    def _update_related_cottages_currency(self, new_price):
        """
        Updates currency_price on all related Cottage instances
        whenever prf_currency_price changes.
        """
        with transaction.atomic():
            # Retrieve all cottages linked to this Performa
            cottages_qs = self.cottages.all()
            for cottage in cottages_qs:
                cottage.currency_price = new_price
                # Save triggers Cottage's logic (recalculate_goods, etc.)
                cottage.save()

    def __str__(self):
        return f"Performa {self.prf_order_no}"

    @property
    def total_cottage_value(self):
        return self.cottages.aggregate(total=models.Sum('total_value'))['total'] or Decimal('0.00')
    class Meta:
        ordering = ["-prf_date"] 