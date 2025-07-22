from django.urls import path, include
from .views import ChatbotAPIView, TranslateToEnglishView, ChatbotNormalAPIView



urlpatterns = [

    path('chatbot/', ChatbotAPIView.as_view(), name='chatbot-api'),
    path("translate/", TranslateToEnglishView.as_view(), name="translate_to_english"),
    path('chatbot-o4/', ChatbotNormalAPIView.as_view(), name='chatbot-o4'),


]
