# proforma/admin.py

from django.contrib import admin
from .models import Performa
from jalali_date.admin import ModelAdminJalaliMixin, StackedInlineJalaliMixin, TabularInlineJalaliMixin	

@admin.register(Performa)
class PerformaAdmin(ModelAdminJalaliMixin, admin.ModelAdmin):
    list_display = ('prf_order_no', 'prf_seller_name', 'prf_total_price', 'prf_status')

