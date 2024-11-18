from django.db import models
from proforma.models import Performa

class Cottage(models.Model):
    cottage_number = models.IntegerField()
    cottage_date = models.DateField()
    proforma = models.ForeignKey(Performa, to_field='prf_order_no', on_delete=models.CASCADE, related_name='cottages')
    total_value = models.DecimalField(max_digits=15, decimal_places=2)
    quantity = models.PositiveIntegerField()
    customs_value = models.DecimalField(max_digits=20, decimal_places=2)
    import_rights = models.DecimalField(max_digits=20, decimal_places=2)
    red_cersent = models.DecimalField(max_digits=5, decimal_places=2)
    added_value = models.DecimalField(max_digits=20, decimal_places=2)
    discount = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    currency_price = models.DecimalField(max_digits=15, decimal_places=2)
    other_expense = models.DecimalField(max_digits=15, decimal_places=2)
    final_price = models.IntegerField( blank=True, editable=False)

    def calculate_final_price(self):
 
        final_price = (
            ((self.total_value*self.currency_price) / self.quantity) + self.customs_value + self.import_rights +
            self.added_value + self.other_expense
        )
        return final_price

    def save(self, *args, **kwargs):
        # Automatically calculate `final_price` before saving
        self.final_price = self.calculate_final_price()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Cottage {self.cottage_number} - {self.proforma}"
