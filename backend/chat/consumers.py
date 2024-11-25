import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import ChatMessage
from django.contrib.auth import get_user_model

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f"chat_{self.room_name}"

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        sender_username = data['sender']
        receiver_username = data['receiver']

        # Сохраняем сообщение в базу данных
        sender = await self.get_user(sender_username)
        receiver = await self.get_user(receiver_username)

        if sender and receiver:
            chat_message = ChatMessage(
                sender=sender,
                receiver=receiver,
                message=message
            )
            await self.save_message(chat_message)

        # Отправляем сообщение группе
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender': sender_username,
                'receiver': receiver_username,
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'sender': event['sender'],
            'receiver': event['receiver'],
        }))

    @staticmethod
    async def get_user(username):
        try:
            return User.objects.get(username=username)
        except User.DoesNotExist:
            return None

    @staticmethod
    async def save_message(chat_message):
        chat_message.save()
