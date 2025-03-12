from django.urls import path, include
from .views import ChatbotAPIView, TranslateToEnglishView



urlpatterns = [

    path('chatbot/', ChatbotAPIView.as_view(), name='chatbot-api'),
    path("translate/", TranslateToEnglishView.as_view(), name="translate_to_english"),


]
