from django.urls import path
from .views import PerformaListView, PerformaDetailView, GUIDApiView

urlpatterns = [
    path('api/performas/', PerformaListView.as_view(), name='performa-list'),
    path('api/performas/<int:prf_order_no>/', PerformaDetailView.as_view(), name='performa-detail'),
    path('api/guid/', GUIDApiView.as_view(), name='guid-api'),
]
