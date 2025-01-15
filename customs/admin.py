from django.contrib import admin
from .models import HSCode, Heading, SubHeading, Tag

@admin.register(Heading)
class HeadingAdmin(admin.ModelAdmin):
    list_display = ('title', 'description')

@admin.register(SubHeading)
class SubHeadingAdmin(admin.ModelAdmin):
    list_display = ('title', 'heading', 'description')
@admin.register(Tag)
class TagAdmin (admin.ModelAdmin):
    list_display = ['tag']

@admin.register(HSCode)
class HSCodeAdmin (admin.ModelAdmin):
    list_display = ('code','goods_name_en')