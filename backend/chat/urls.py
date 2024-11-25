from django.urls import path
from .views import ChatHistoryView, CreateChatView

urlpatterns = [
    path('history/<str:room_name>/', ChatHistoryView.as_view(), name='chat-history-room'),
    path('history/', ChatHistoryView.as_view(), name='chat-history-users'),
    path('create/', CreateChatView.as_view(), name='create-chat'),
]
