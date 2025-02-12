from django.contrib import admin
from .models import ImageTemplate, Seller, Buyer, Invoice, InvoiceItem




@admin.register(ImageTemplate)
class ImageTemplateAdmin(admin.ModelAdmin):
    list_display = ("name", )

@admin.register(Seller)
class SellerAdmin(admin.ModelAdmin):
   list_display = ("seller_name",)

@admin.register(Buyer)
class BuyerAdmin(admin.ModelAdmin):
   list_display = ("buyer_name",)

@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
   list_display = ("invoice_number",)

@admin.register(InvoiceItem)
class InvoiceAdmin(admin.ModelAdmin):
   list_display = ("description",)