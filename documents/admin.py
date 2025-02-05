from django.contrib import admin
from .models import ImageTemplate




@admin.register(ImageTemplate)
class ImageTemplateAdmin(admin.ModelAdmin):
    list_display = ("name", )
