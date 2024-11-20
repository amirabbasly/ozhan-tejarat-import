from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CottageViewSet, CustomsDeclarationListView

router = DefaultRouter()
router.register(r'cottages', CottageViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('customs-declarations/', CustomsDeclarationListView.as_view(), name='customs_declarations'),

]
