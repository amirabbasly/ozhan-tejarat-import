from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RepresentationViewSet, CheckViewSet, ImportRepresentationsView, ImportChecksView, SummaryView

router = DefaultRouter()
router.register('representations', RepresentationViewSet, basename='representation')
router.register('checks', CheckViewSet, basename='check')
urlpatterns = [
    path('', include(router.urls)),
    path('import-representation/', ImportRepresentationsView.as_view(),name="import_representation"),
    path('import-check/', ImportChecksView.as_view(),name="import_check"),
    path('rep-dashboard/', SummaryView.as_view(),name="summary"),


]
