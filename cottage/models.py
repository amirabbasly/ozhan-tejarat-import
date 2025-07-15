from django.db import models, transaction
from proforma.models import Performa
from decimal import Decimal
from django_jalali.db import models as jmodels
from django.core.exceptions import ValidationError
from accounts.models import Costumer
from django.db.models import Sum, F, DecimalField

class Cottage(models.Model):
    cottage_number = models.IntegerField(unique=True)
    cottage_date = jmodels.jDateField()
    booked = models.BooleanField(default=False)
    proforma = models.ForeignKey(Performa, to_field='prf_order_no', on_delete=models.CASCADE, related_name='cottages')
    refrence_number = models.CharField(null=True, blank=True)
    total_value = models.DecimalField(max_digits=20, decimal_places=2)
    customs_value = models.DecimalField(max_digits=28, decimal_places=2, null=True, blank=True)
    quantity = models.PositiveIntegerField()
    currency_price = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True)
    cottage_customer = models.ForeignKey(Costumer, on_delete=models.SET_NULL, null=True, blank=True)
    cottage_status = models.CharField(max_length=55,null=True, blank=True)
    rafee_taahod = models.BooleanField(default=False)
    docs_recieved = models.BooleanField(default=False)
    rewatch = models.BooleanField(default=False)
    Intermediary = models.CharField(max_length=50, null=True, blank=True)
    documents = models.FileField(null=True,blank=True )
    added_value = models.DecimalField(max_digits=30, decimal_places=2, null=True, blank=True, default=0)
    total_expenses = models.DecimalField(max_digits=30, decimal_places=2, null=True, blank=True, default=0)

    class Meta:
        ordering = ["-cottage_date"] 


    def __str__(self):
        return f"Cottage {self.cottage_number} - {self.proforma}"

    def _update_customs_value(self):
        """
        Sum up import_rights + customs_value + added_value + red_cersent
        across all related CottageGoods and write it back to self.customs_value.
        """
        agg = self.cottage_goods.aggregate(
            total=Sum(
                F('import_rights')
                - F('discount')
                + F('added_value')
                + F('red_cersent'),
                output_field=DecimalField()
            ),
            added_total=Sum(
                F('added_value'),
                output_field=DecimalField()
            )
        )
        agg_exp = self.expenses.aggregate(
            total_expenses=Sum(
                F('value'),
                output_field=DecimalField()

            )
        ) 
        total_expenses = agg_exp['total_expenses'] or Decimal('0')
        added_total = agg['added_total'] or Decimal('0')
        total = agg['total'] or Decimal('0')
        # write directly to the DB, avoid re-entering save()
        Cottage.objects.filter(pk=self.pk).update(
        customs_value=total,
        added_value=added_total,
        total_expenses=total_expenses
    )
        # also update the in-memory instance
        self.customs_value = total

    def save(self, *args, **kwargs):
        if not self.currency_price and self.proforma.prf_currency_price is not None:
            self.currency_price = self.proforma.prf_currency_price
        with transaction.atomic():
            # Lock the related proforma for concurrency safety
            proforma = Performa.objects.select_for_update().get(prfVCodeInt=self.proforma.prfVCodeInt)

            # Save the cottage
            super().save(*args, **kwargs)

            # Update the proforma to recalculate remaining_total and exceeded_amount
            proforma.save()

        # Always recalculate related CottageGoods after saving Cottage
        if self.pk:
            self._update_customs_value()
            self.recalculate_goods()

    def delete(self, *args, **kwargs):
        with transaction.atomic():
            proforma = Performa.objects.select_for_update().get(prfVCodeInt=self.proforma.prfVCodeInt)
            super().delete(*args, **kwargs)
            # Re-save the proforma to update the remain totals
            proforma.save()
        if self.pk:
            self.recalculate_goods()

    def recalculate_goods(self):
        # Recalculate all related goods when the currency_price changes
        related_goods = self.cottage_goods.all()
        for good in related_goods:
            good.recalculate_fields()
            good.save()
        self._update_customs_value()


class CottageGoods(models.Model):
    goodscode = models.CharField(unique=True,max_length=20)
    cottage = models.ForeignKey(Cottage, related_name='cottage_goods', on_delete=models.CASCADE)
    customs_value = models.DecimalField(max_digits=20, decimal_places=2)
    import_rights = models.DecimalField(max_digits=20, decimal_places=2)
    quantity = models.DecimalField(max_digits=10, decimal_places=3, null=True, blank=True) 
    red_cersent = models.DecimalField(max_digits=20, decimal_places=2)
    total_value = models.DecimalField(max_digits=20, decimal_places=2)
    added_value = models.DecimalField(max_digits=20, decimal_places=2)
    discount = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True, default=0)
    riali = models.DecimalField(max_digits=20, decimal_places=2 ,blank=True, editable=False, default=0)
    hhhg = models.DecimalField(max_digits=20, decimal_places=2, blank=True, editable=False, default=0)
    other_expense = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True, default=None)
    final_price = models.DecimalField(max_digits=20, decimal_places=2,blank=True, editable=False, default=0)
    goods_description = models.CharField(null=True, blank=True, max_length=500)
    class Meta:
        ordering = ["-cottage__cottage_date"] 

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
        # Calculate only if `other_expense` is not manually set
        if self.other_expense is None:
            return (self.hhhg or Decimal(0)) * Decimal('1.5') / Decimal('100')
        return self.other_expense

    def calculate_final_price(self):
        return (self.hhhg or Decimal(0)) + (self.other_expense or Decimal(0))

    def recalculate_fields(self):
        self.riali = self.calculate_riali()
        self.hhhg = self.calculate_hhhg()
        self.other_expense = self.calculate_other_expense()
        self.final_price = self.calculate_final_price()


    def save(self, *args, **kwargs):
        self.riali = self.calculate_riali()
        self.hhhg = self.calculate_hhhg()
        self.other_expense = self.calculate_other_expense()
        self.final_price = self.calculate_final_price()
        super().save(*args, **kwargs)
        self.cottage._update_customs_value()

    def delete(self, *args, **kwargs):
        cottage = self.cottage
        super().delete(*args, **kwargs)
        cottage._update_customs_value()
    

class ExportedCottages(models.Model):
    full_serial_number = models.CharField(unique=True)
    cottage_date = models.CharField(max_length=55)
    total_value = models.DecimalField(max_digits=20, decimal_places=2)
    quantity = models.PositiveIntegerField()
    currency_type = models.CharField(max_length=55, default="USD")
    currency_price = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True)
    declaration_status = models.CharField(max_length=55,null=True, blank=True)
    remaining_total = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True)
    class Meta:
        ordering = ["-id"] 

class Expenses(models.Model):
    cottage = models.ForeignKey(Cottage, related_name='expenses', on_delete=models.CASCADE)
    value = models.DecimalField(max_digits=30, decimal_places=2)
    description = models.CharField(max_length=255, null=True, blank=True)
    receipt = models.ImageField(upload_to='receipts/', null=True, blank=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.cottage._update_customs_value()

    def delete(self, *args, **kwargs):
        cottage = self.cottage
        super().delete(*args, **kwargs)
        cottage._update_customs_value()