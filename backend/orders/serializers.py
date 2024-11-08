from rest_framework import serializers
from .models import Order


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'

    def create(self, validated_data):
        # Добавление текущего пользователя в validated_data
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['user'] = request.user
        return super().create(validated_data)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['userId'] = instance.user.id
        data['itemId'] = instance.item.id
        data['startDate'] = data.pop('start_date')
        data['endDate'] = data.pop('end_date')
        data['totalAmount'] = data.pop('total_amount')
        return data
