from django.urls import path, include
from .views import ChatbotAPIView



urlpatterns = [

    path('chatbot/', ChatbotAPIView.as_view(), name='chatbot-api'),

]
