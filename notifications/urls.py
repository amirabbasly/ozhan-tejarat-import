from django.urls import path, include
from .views import NotificationListView, MarkNotificationReadView, MarkAllNotificationsReadView, CalendarEventViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'events', CalendarEventViewSet)


urlpatterns = [
    path('sets/', include(router.urls)),
    path('', NotificationListView.as_view(), name='notification_list'),
    path('<int:notification_id>/read/', MarkNotificationReadView.as_view(), name='mark_notification_read'),
    path('read-all/', MarkAllNotificationsReadView.as_view(), name='mark_all_as_read'),

]
