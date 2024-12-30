from django.urls import path
from .views import PerformaListView, PerformaDetailView, GUIDApiView, SaveSelectedPerformas,UpdatePerformaView, PerformaDeleteView, PerformaCreateView, PerformaCombinedDataView

urlpatterns = [
    path('performas/', PerformaListView.as_view(), name='performa-list'),
    path('performas/<int:prf_order_no>/', PerformaDetailView.as_view(), name='performa-detail'),
    path('guid/', GUIDApiView.as_view(), name='guid-api'),
    path('orders/<int:prf_order_no>/', UpdatePerformaView.as_view(), name='update'),
    path('save-selected-performas/', SaveSelectedPerformas.as_view(), name='save_selected_performas'),
    path('performas/delete/', PerformaDeleteView.as_view(), name='delete_performas'),
    path('new-performa/', PerformaCreateView.as_view(), name='add_performas'),
    path('prf-summary/', PerformaCombinedDataView.as_view(), name='performa-summary'),




]
