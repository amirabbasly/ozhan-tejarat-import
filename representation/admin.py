from django.contrib import admin
from .models import Representation
from jalali_date.admin import ModelAdminJalaliMixin, StackedInlineJalaliMixin, TabularInlineJalaliMixin	

@admin.register(Representation)
class RepresentationAdmin(admin.ModelAdmin):
    list_display = ('representor', 'representi', 'start_date', 'end_date', 'doc_number', 'verification_code')
    search_fields = ('representor', 'representi', 'doc_number', 'verification_code')