from django.urls import path, include
from .views import OverlayTextView



urlpatterns = [

    path('origin-cert/', OverlayTextView.as_view(), name='certificate-of-origin'),

]
