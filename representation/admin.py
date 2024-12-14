from django.contrib import admin
from .models import Representation, Check
from jalali_date.admin import ModelAdminJalaliMixin, StackedInlineJalaliMixin, TabularInlineJalaliMixin	

@admin.register(Representation)
class RepresentationAdmin(admin.ModelAdmin):
    list_display = ('representor', 'representi', 'start_date', 'end_date', 'doc_number', 'verification_code')
    search_fields = ('representor', 'representi', 'doc_number', 'verification_code')

@admin.register(Check)
class CheckAdmin(admin.ModelAdmin):
    list_display = ('issuer','issued_for','check_code')
    search_fields = ('check_code',)