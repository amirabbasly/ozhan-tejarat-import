from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import RegisterView, LoginView, UserRolesView,costumerViewSet, CostumerListView
from rest_framework_simplejwt.views import TokenRefreshView
router = DefaultRouter()
router.register('costumers', costumerViewSet, basename='costumers')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user_role/', UserRolesView.as_view(), name='user_role'),
    path('costumer_list/', CostumerListView.as_view(), name='costumer_list'),


]
