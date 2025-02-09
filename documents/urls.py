from django.urls import path, include
from .views import OverlayTextView , TemplateListView, FillExcelTemplateView



urlpatterns = [

    path('origin-cert/', OverlayTextView.as_view(), name='certificate-of-origin'),
    path('templates/', TemplateListView.as_view(), name='template-list'),
    path('fill_inv/', FillExcelTemplateView.as_view(), name='fill_excel'),

]
