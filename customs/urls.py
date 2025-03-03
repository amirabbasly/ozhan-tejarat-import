# hscode/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HSCodeImportView, FetchAndUpdateHSCodeView, HSCodeViewSet, HSCodeListView, ImportHeadingsView, ImportSeasonsView, HSCodeDetailByCodeView, CurrencyExchangeRateView, ImportHSDataView

router = DefaultRouter()

router.register(r'hscodes', HSCodeViewSet, basename='hscode')

urlpatterns = [
    path('', include(router.urls)),
    path('import-hscode/', HSCodeImportView.as_view(), name='import_hscode'),
    path('code-list/', HSCodeListView.as_view(), name='list_hscode'),
    path("fetch-update-hscode/", FetchAndUpdateHSCodeView.as_view(), name="fetch_update_hscode"),
    path('import-seasons/', ImportSeasonsView.as_view(), name='season_import'),
    path('import-headings/', ImportHeadingsView.as_view(), name='heading_import'),
    path('hscode-detail/', HSCodeDetailByCodeView.as_view(), name='hscode-detail-by-code'),
    path('import-tags/', ImportHSDataView.as_view(), name='hscode-tags'),
    path('currency-exchange-rates/', CurrencyExchangeRateView.as_view(), name='currency-exchange-rates'),

]
