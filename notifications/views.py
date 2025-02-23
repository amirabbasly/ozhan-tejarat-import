from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Notification, Events
from rest_framework import viewsets
from .serializers import CalendarEventSerializer

class NotificationListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """
        Get all notifications for the authenticated user.
        """
        notifications = Notification.objects.filter(user=request.user).order_by('-created_at')
        notifications_data = [
            {
                'id': n.id,
                'message': n.message,
                'type': n.type,
                'is_read': n.is_read,
                'created_at': n.created_at,
            }
            for n in notifications
        ]
        return Response(notifications_data, status=status.HTTP_200_OK)
        
class MarkNotificationReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, notification_id):
        """
        Mark a notification as read.
        """
        try:
            notification = Notification.objects.get(id=notification_id, user=request.user)
            notification.is_read = True
            notification.save()
            return Response({'message': 'Notification marked as read.'}, status=status.HTTP_200_OK)
        except Notification.DoesNotExist:
            return Response({'error': 'Notification not found.'}, status=status.HTTP_404_NOT_FOUND)

class MarkAllNotificationsReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        notifications = Notification.objects.filter(user=request.user, is_read=False)
        notifications.update(is_read=True)
        return Response({'message': 'All notifications marked as read.'}, status=status.HTTP_200_OK)

class CalendarEventViewSet(viewsets.ModelViewSet):
    queryset = Events.objects.all()
    serializer_class = CalendarEventSerializer