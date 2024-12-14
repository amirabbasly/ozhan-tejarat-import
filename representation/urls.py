from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RepresentationViewSet, CheckViewSet

router = DefaultRouter()
router.register('representations', RepresentationViewSet, basename='representation')
router.register('checks', CheckViewSet, basename='check')
urlpatterns = [
    path('', include(router.urls)),
]
