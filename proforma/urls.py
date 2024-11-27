from django.urls import path
from .views import PerformaListView, PerformaDetailView, GUIDApiView, SaveSelectedPerformas

urlpatterns = [
    path('performas/', PerformaListView.as_view(), name='performa-list'),
    path('performas/<int:prf_order_no>/', PerformaDetailView.as_view(), name='performa-detail'),
    path('guid/', GUIDApiView.as_view(), name='guid-api'),
    path('save-selected-performas/', SaveSelectedPerformas.as_view(), name='save_selected_performas'),

]
