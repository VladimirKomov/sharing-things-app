from rest_framework import serializers

from items.serializers import ItemSerializer
from .models import Order


class OrderSerializer(serializers.ModelSerializer):

    class Meta:
        model = Order
        fields = '__all__'

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['user'] = request.user
        return super().create(validated_data)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['itemId'] = instance.item.id
        data['itemName'] = instance.item.name
        data['ownerId'] = instance.item.user.id
        data['ownerName'] = instance.item.user.username
        data['userId'] = data.pop('user')
        data['userName'] = instance.user.username
        data['startDate'] = data.pop('start_date')
        data['endDate'] = data.pop('end_date')
        data['totalAmount'] = data.pop('total_amount')
        return data
