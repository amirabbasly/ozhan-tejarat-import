from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CottageViewSet, CustomsDeclarationListView, GreenCustomsDeclarationView, SaveCottageView, SaveCottageGoodsView, FetchGoodsAPIView,FetchCustomsDutyInformationAPIView, upload_file,CottageGoodsViewSet, CottageCombinedDataView, ExportCustomsDeclarationListView, ExportedCottagesViewSet, FetchCotageRemainAmountView, ChatbotAPIView, ImportExportedCottagesView, ImportCottagesView, CottageExcelExportView, ExpensesViewSet, CottageGoodsExportView
router = DefaultRouter()
router.register(r'cottages', CottageViewSet)
router.register(r'cottage-goods', CottageGoodsViewSet, basename='cottagegoods')
router.register(r'exported-cottage', ExportedCottagesViewSet, basename='exportedcottages')
router.register(r'expenses', ExpensesViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('customs-declarations/', CustomsDeclarationListView.as_view(), name='customs_declarations'),
    path('customs-green-declaration/', GreenCustomsDeclarationView.as_view(), name='green-customs-declaration'),
    path('save-cottage/', SaveCottageView.as_view(), name='save_cottage'),
    path('save-cottage-goods/', SaveCottageGoodsView.as_view(), name='save_cottage_goods'),
    path('fetch-goods/', FetchGoodsAPIView.as_view(), name='fetch_goods'),
    path('fetch-customs-duty-info/', FetchCustomsDutyInformationAPIView.as_view(), name='fetch_customs_duty_info'),
    path('cottages/<int:cottage_id>/upload/', upload_file, name='upload_file'),
    path('cot-summary/', CottageCombinedDataView.as_view(), name='cottage-summary'),
    path('export-customs-declarations/', ExportCustomsDeclarationListView.as_view(), name='customs_declarations'),    
    path('fetch-cotage-remain-amount/', FetchCotageRemainAmountView.as_view(), name='fetch-cotage-remain-amount'),
    path('import-cottages/', ImportCottagesView.as_view(), name='import_cottages'),
    path('import-exported-cottages/', ImportExportedCottagesView.as_view(), name='import_exported_cottages'),
    path("export-cottages-excel/",CottageExcelExportView.as_view(),name="export-cottages"),
    path("export-cottage-goods-excel/",CottageGoodsExportView.as_view(),name="export-cottages"),

]
