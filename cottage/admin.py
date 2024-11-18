from django.contrib import admin
from .models import Cottage


@admin.register(Cottage)
class CottageAdmin(admin.ModelAdmin):
    list_display = ("cottage_number", "cottage_date")
    readonly_fields = ['final_price']  # Make it visible but not editable


# Register your models here.
