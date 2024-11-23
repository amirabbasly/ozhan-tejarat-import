from django.db import models
from proforma.models import Performa
from decimal import Decimal

class Cottage(models.Model):
    cottage_number = models.IntegerField(unique=True)
    cottage_date = models.DateField()
    proforma = models.ForeignKey(Performa, to_field='prf_order_no', on_delete=models.CASCADE, related_name='cottages')
    total_value = models.DecimalField(max_digits=15, decimal_places=2)
    quantity = models.PositiveIntegerField()
    currency_price = models.DecimalField(max_digits=20, decimal_places=2)




    def __str__(self):
        return f"Cottage {self.cottage_number} - {self.proforma}"
class CottageGoods(models.Model):
    goodscode = models.CharField(unique=True,max_length=20)
    cottage = models.ForeignKey(Cottage, on_delete=models.CASCADE)
    customs_value = models.DecimalField(max_digits=20, decimal_places=2)
    import_rights = models.DecimalField(max_digits=20, decimal_places=2)
    red_cersent = models.DecimalField(max_digits=20, decimal_places=2)
    total_value = models.DecimalField(max_digits=15, decimal_places=2)
    added_value = models.DecimalField(max_digits=20, decimal_places=2)
    discount = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True, default=0)
    riali = models.IntegerField( blank=True, editable=False, default=0)
    hhhg = models.DecimalField(max_digits=20, decimal_places=2, blank=True, editable=False, default=0)
    other_expense = models.DecimalField(max_digits=20, decimal_places=2, blank=True, editable=False, default=0)
    final_price = models.IntegerField(blank=True, editable=False, default=0)

    def calculate_riali(self):
        return (self.total_value or Decimal(0)) * (self.cottage.currency_price or Decimal(0))

    def calculate_hhhg(self):
        return (
            (self.import_rights or Decimal(0)) +
            (self.red_cersent or Decimal(0)) -
            (self.discount or Decimal(0)) +
            (self.riali or Decimal(0))
        )

    def calculate_other_expense(self):
        return (self.hhhg or Decimal(0)) * Decimal('1.5') / Decimal('100')

    def calculate_final_price(self):
        return (self.hhhg or Decimal(0)) + (self.other_expense or Decimal(0))


    def save(self, *args, **kwargs):
        self.riali = self.calculate_riali()
        self.hhhg = self.calculate_hhhg()
        self.other_expense = self.calculate_other_expense()
        self.final_price = self.calculate_final_price()
        super().save(*args, **kwargs)

        