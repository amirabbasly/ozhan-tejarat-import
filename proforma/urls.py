from django.urls import path
from . import views

urlpatterns = [
    path('performas/', views.performa_list, name='performa_list'),
    path('performas/<int:id>/details/', views.performa_details, name='performa_details'),
    path('get_ssdsshGUID/', views.get_ssdsshGUID, name='get_ssdsshGUID'),
    # ... other URL patterns ...
]
