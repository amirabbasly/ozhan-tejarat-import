from django.contrib import admin
from .models import Notification, Events

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("user", "message")

@admin.register(Events)
class EventsAdmin(admin.ModelAdmin):
    list_display = ("title", "description")
