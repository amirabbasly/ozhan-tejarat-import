from django.contrib import admin
from .models import Cottage, CottageGoods


@admin.register(Cottage)
class CottageAdmin(admin.ModelAdmin):
    list_display = ("cottage_number", "cottage_date")
@admin.register(CottageGoods)
class CottageGoodsAdmin(admin.ModelAdmin):
    list_display = ("cottage", "final_price")
    readonly_fields = ["riali","hhhg","final_price","other_expense"]




