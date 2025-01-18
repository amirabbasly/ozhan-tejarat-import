from django.contrib import admin
from .models import HSCode, Heading, Tag, Season

@admin.register(Heading)
class HeadingAdmin(admin.ModelAdmin):
    list_display = ('code', 'description')

@admin.register(Tag)
class TagAdmin (admin.ModelAdmin):
    list_display = ['tag']

@admin.register(HSCode)
class HSCodeAdmin (admin.ModelAdmin):
    list_display = ('code','goods_name_en')
@admin.register(Season)
class SeasonAdmin (admin.ModelAdmin):
    list_display = ('code','description')