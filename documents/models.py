from django.db import models
from accounts.models import Costumer
from chatbot.views import translate_farsi_to_english


class ImageTemplate(models.Model):
    name = models.CharField(max_length=255)
    template_image = models.ImageField(upload_to='templates/')

    # Existing fields:
    exporter_position = models.CharField(max_length=255)
    consignee_position = models.CharField(max_length=255)
    means_of_transport_position = models.CharField(max_length=255)

    description_position = models.CharField(max_length=255)
    hscode_position = models.CharField(max_length=255)
    quantity_position = models.CharField(max_length=255)
    number_of_invoices_position = models.CharField(max_length=255)
    goods_line_height = models.IntegerField()

    # NEW field: anchor point for where the first Good line should start
    goods_start_position = models.CharField(
        max_length=255,
        default="100,300",  # set whatever default x,y you want
        help_text="X,Y coordinate for the initial line of goods"
    )
    font_size = models.IntegerField(default=20)

    def __str__(self):
        return self.name

class Seller(models.Model):
    seller_name = models.CharField (max_length=255)
    seller_address = models.TextField(max_length=2000)
    seller_country = models.CharField(max_length=55, null=True, blank=True)
    seller_bank_name = models.CharField(max_length=55, null=True, blank=True)
    seller_account_name = models.CharField(max_length=255, null=True, blank=True)
    seller_iban = models.CharField(max_length=55, null=True, blank=True)
    seller_swift = models.CharField(max_length=55, null=True, blank=True)
    seller_seal = models.ImageField(upload_to='seals/', null=True, blank=True)
    seller_logo = models.ImageField(upload_to='seals/', null=True, blank=True)
    
class Buyer(models.Model):
    buyer_name = models.CharField(max_length=255)
    buyer_card_number = models.CharField(max_length=55)
    buyer_address = models.CharField(max_length=555)
    buyer_tel = models.CharField(max_length=55,null=True, blank=True)


class Invoice(models.Model):
    seller = models.ForeignKey('Seller', on_delete=models.CASCADE)
    buyer = models.ForeignKey('Buyer', on_delete=models.CASCADE)
    sub_total = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    invoice_date = models.DateField()
    customer_tel = models.CharField(max_length=15, null=True, blank=True)
    invoice_id = models.CharField(max_length=50, unique=True)
    invoice_number = models.CharField(max_length=50)
    freight_charges = models.DecimalField(max_digits=18, decimal_places=2)
    invoice_currency = models.CharField(max_length=50)
    terms_of_delivery = models.CharField(max_length=50)
    relevant_location = models.CharField(max_length=555)
    means_of_transport = models.CharField(max_length=50)
    country_of_origin = models.CharField(max_length=555)
    port_of_loading = models.CharField(max_length=555)
    total_gw = models.DecimalField(default=0, max_digits=12, decimal_places=2,)
    total_nw = models.DecimalField(default=0, max_digits=12, decimal_places=2,)
    total_qty = models.DecimalField(default=0, max_digits=12, decimal_places=2,)
    total_pack = models.IntegerField(default=0)
    

    
    def __str__(self):
        return f"Invoice {self.invoice_number}"


class InvoiceItem(models.Model):
    invoice = models.ForeignKey(Invoice, related_name='items', on_delete=models.CASCADE)
    description = models.TextField(max_length=1555)
    quantity = models.DecimalField(default=1, max_digits=18, decimal_places=2)
    commodity_code = models.IntegerField(max_length=9)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    unit = models.CharField(max_length=55, default="U")
    pack = models.IntegerField(default=1)
    nw_kg = models.DecimalField(default=1, max_digits=12, decimal_places=2,)
    gw_kg = models.DecimalField(default=1, max_digits=12, decimal_places=2,)
    origin = models.CharField(max_length=55)
    @property
    def line_total(self):
        return self.quantity * self.unit_price

    def __str__(self):
        return f"Item for Invoice {self.invoice.invoice_number}"
class ProformaInvoice(models.Model):
    seller = models.ForeignKey('Seller', on_delete=models.CASCADE)
    buyer = models.ForeignKey('Buyer', on_delete=models.CASCADE)
    sub_total = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    proforma_invoice_date = models.DateField()
    proforma_invoice_exp_date = models.DateField()
    # e.g. an automatically generated invoice number
    proforma_invoice_id = models.CharField(max_length=50, unique=True)
    proforma_invoice_number = models.CharField(max_length=50)
    proforma_freight_charges = models.DecimalField(max_digits=18, decimal_places=2)
    proforma_invoice_currency = models.CharField(max_length=50)
    terms_of_delivery = models.CharField(max_length=50)
    terms_of_payment = models.CharField(max_length=50)
    partial_shipment = models.BooleanField(default=False)
    relevant_location = models.CharField(max_length=555)
    means_of_transport = models.CharField(max_length=50)
    country_of_origin = models.CharField(max_length=555)
    port_of_loading = models.CharField(max_length=555)
    standard = models.CharField(max_length=50)
    total_gw = models.DecimalField(default=0, max_digits=12, decimal_places=2,)
    total_nw = models.DecimalField(default=0, max_digits=12, decimal_places=2,)
    total_qty = models.DecimalField(default=0, max_digits=12, decimal_places=2,)
    

    
    def __str__(self):
        return f"Invoice {self.proforma_invoice_number}"

class ProformaInvoiceItem(models.Model):
    proforma_invoice = models.ForeignKey(ProformaInvoice, related_name='items', on_delete=models.CASCADE)
    original_description = models.TextField(max_length=1555, blank=True, null=True)
    translated_description = models.TextField(max_length=1555)
    quantity = models.DecimalField(default=1, max_digits=18, decimal_places=2)
    commodity_code = models.IntegerField(max_length=9)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    unit = models.CharField(max_length=55, default="U")
    nw_kg = models.DecimalField(default=1, max_digits=12, decimal_places=2,)
    gw_kg = models.DecimalField(default=1, max_digits=12, decimal_places=2,)
    origin = models.CharField(max_length=55)


    @property
    def line_total(self):
        return self.quantity * self.unit_price

    def save(self, *args, **kwargs):
        # Only translate if we have Farsi text and no English translation yet
        if self.original_description and not self.translated_description:
            try:
                self.translated_description = translate_farsi_to_english(
                    self.original_description
                )
            except Exception as e:
                # If there's an error, you might log it or ignore it
                print(f"Error translating description: {e}")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Item for Invoice {self.proforma_invoice.proforma_invoice_number}"