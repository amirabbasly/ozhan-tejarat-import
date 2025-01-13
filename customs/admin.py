from django.contrib import admin
from .models import Tag, HSCode

@admin.register(Tag)
class TagAdmin (admin.ModelAdmin):
    list_display = ['tag']

@admin.register(HSCode)
class HSCodeAdmin (admin.ModelAdmin):
    list_display = ('code','goods_name_en')