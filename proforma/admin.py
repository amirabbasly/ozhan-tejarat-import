from django.contrib import admin
from .models import Performa, ProformaDetail, ProformaPayment


class proformaAdmin(admin.ModelAdmin):
   list_display = (
   'prf_number',

        # Add any other fields you want to display
    )

admin.site.register(Performa, proformaAdmin)
admin.site.register(ProformaDetail)
admin.site.register(ProformaPayment)
# Register your models here.
