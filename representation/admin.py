from django.contrib import admin
from .models import Representation, Check
from jalali_date.admin import ModelAdminJalaliMixin, StackedInlineJalaliMixin, TabularInlineJalaliMixin	

@admin.register(Representation)
class RepresentationAdmin(admin.ModelAdmin):
    list_display = ( 'display_principals', 'display_attorneys', 'start_date', 'end_date', 'doc_number', 'verification_code')
    search_fields = ('representor', 'representi', 'doc_number', 'verification_code')
    def display_principals(self, obj):
        # returns a comma-separated list of principal names
        return ", ".join([c.full_name for c in obj.representi.all()])
    display_principals.short_description = 'موکل‌ها'

    def display_attorneys(self, obj):
        return ", ".join([c.full_name for c in obj.representor.all()])
    display_attorneys.short_description = 'وکیل‌ها'
@admin.register(Check)
class CheckAdmin(admin.ModelAdmin):
    list_display = ('issuer','issued_for','check_code')
    search_fields = ('check_code',)