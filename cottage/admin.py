from django.contrib import admin
from .models import Cottage, CottageGoods, ExportedCottages
from jalali_date.admin import ModelAdminJalaliMixin, StackedInlineJalaliMixin, TabularInlineJalaliMixin	





@admin.register(Cottage)
class CottageAdmin(ModelAdminJalaliMixin, admin.ModelAdmin):

    list_display = ('cottage_number', 'cottage_date', 'total_value')


@admin.register(CottageGoods)
class CottageGoodsAdmin(admin.ModelAdmin):
    list_display = ("cottage", "goodscode")
    readonly_fields = ["riali","hhhg","final_price","other_expense"]



@admin.register(ExportedCottages)
class ExportedCottageAdmin(admin.ModelAdmin):
    list_display = ('cottage_date', 'total_value')
    
