from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import ChatMessage, Chat
from .serializers import ChatMessageSerializer, ChatSerializer


class ChatHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, room_name=None):
        # Если чат связан с комнатой
        if room_name:
            messages = ChatMessage.objects.filter(receiver__username=room_name).order_by('timestamp')
        else:
            # Чат между двумя пользователями
            sender = request.user
            receiver_username = request.query_params.get('receiver')
            if not receiver_username:
                return Response({"error": "Receiver is required"}, status=400)

            messages = ChatMessage.objects.filter(
                sender=sender, receiver__username=receiver_username
            ) | ChatMessage.objects.filter(
                sender__username=receiver_username, receiver=sender
            )
            messages = messages.order_by('timestamp')

        serializer = ChatMessageSerializer(messages, many=True)
        return Response(serializer.data)


class CreateChatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        participants = request.data.get('participants')  # List of user IDs
        if not participants or len(participants) < 2:
            return Response({"error": "At least 2 participants are required"}, status=400)

        # Создаём новый чат
        chat = Chat.objects.create()
        chat.participants.set(participants)
        chat.save()

        serializer = ChatSerializer(chat)
        return Response(serializer.data, status=201)