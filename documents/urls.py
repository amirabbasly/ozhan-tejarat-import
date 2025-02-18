from django.urls import path, include
from .views import OverlayTextView , TemplateListView, SellerViewSet, BuyerViewSet, InvoiceViewSet,InvoicePDFView, InvoiceExcelView, PackingPDFView, CertiOriginView,ProformaInvoicePDFView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'sellers', SellerViewSet, basename='seller')
router.register(r'buyers', BuyerViewSet, basename='buyer')
router.register(r'invoices', InvoiceViewSet, basename='invoice')


urlpatterns = [
    path('', include(router.urls)),
    path('origin-cert/', OverlayTextView.as_view(), name='certificate-of-origin'),
    path('origin-cert-V2/', CertiOriginView.as_view(), name='certificate-of-origin'),
    path('templates/', TemplateListView.as_view(), name='template-list'),
    path('invoices/<int:pk>/pdf/', InvoicePDFView.as_view(), name='invoice-pdf'),
    path('invoices/<int:pk>/excel/', InvoiceExcelView.as_view(), name='invoice-excel'),
    path('packing/<int:pk>/pdf/', PackingPDFView.as_view(), name='packing-pdf'),
    path('proforma-invoice/<int:pk>/pdf/', PackingPDFView.as_view(), name='proforma-pdf'),
    
]
