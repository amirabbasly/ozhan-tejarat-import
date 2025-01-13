# hscode/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HSCodeImportView, FetchAndUpdateHSCodeView, HSCodeViewSet

router = DefaultRouter()

router.register(r'hscodes', HSCodeViewSet, basename='hscode')

urlpatterns = [
    path('', include(router.urls)),
    path('import-hscode/', HSCodeImportView.as_view(), name='import_hscode'),
    path("fetch-update-hscode/", FetchAndUpdateHSCodeView.as_view(), name="fetch_update_hscode"),

]
