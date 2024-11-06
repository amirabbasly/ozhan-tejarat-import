from django.urls import path
from . import views

urlpatterns = [
    path('get_ssdsshGUID/', views.get_ssdsshGUID, name='get_ssdsshGUID'),
]
