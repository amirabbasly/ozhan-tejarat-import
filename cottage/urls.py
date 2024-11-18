from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CottageViewSet

router = DefaultRouter()
router.register(r'cottages', CottageViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
