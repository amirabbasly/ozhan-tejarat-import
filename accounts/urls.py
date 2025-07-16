from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import RegisterView, LoginView, UserRolesView,costumerViewSet, CostumerListView, CurrentUserView, UpdateCurrentUserView, ChangePasswordView
from rest_framework_simplejwt.views import TokenRefreshView
router = DefaultRouter()
router.register('customers', costumerViewSet, basename='costumers')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user_role/', UserRolesView.as_view(), name='user_role'),
    path('customer_list/', CostumerListView.as_view(), name='costumer_list'),
    path('profile/', CurrentUserView.as_view(), name='current-user'),
    path('profile/update/', UpdateCurrentUserView.as_view(), name='update-current-user'),
    path('profile/change-password/', ChangePasswordView.as_view(), name='change-password'),

]
