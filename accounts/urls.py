# accounts/urls.py

from django.urls import path
from .views import RegisterView, LoginView, UserRolesView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user_role/', UserRolesView.as_view(), name='user_role'),
]
