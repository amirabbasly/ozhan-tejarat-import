from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RepresentationViewSet

router = DefaultRouter()
router.register('representations', RepresentationViewSet, basename='representation')

urlpatterns = [
    path('', include(router.urls)),
]
