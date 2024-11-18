# proforma/admin.py

from django.contrib import admin
from .models import Performa, ProformaDetail, ProformaPayment, RequestStatus

@admin.register(Performa)
class PerformaAdmin(admin.ModelAdmin):
    list_display = ('prf_order_no', 'prf_seller_name', 'prf_total_price', 'prf_status')

@admin.register(ProformaDetail)
class ProformaDetailAdmin(admin.ModelAdmin):
    list_display = ('performa', 'prfctm_name', 'prfctm_code')

@admin.register(ProformaPayment)
class ProformaPaymentAdmin(admin.ModelAdmin):
    list_display = ('proforma', 'payment_amount', 'payment_date', 'payment_status')

@admin.register(RequestStatus)
class RequestStatusAdmin(admin.ModelAdmin):
    list_display = ('performa', 'pfg_vcode_lng', 'agn_name_str', 'pgp_send_status_tny')
    search_fields = ('performa__prf_number', 'agn_name_str')
