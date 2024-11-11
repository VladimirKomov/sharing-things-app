from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from .models import Order


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'

    # def create(self, validated_data):
    #     request = self.context.get('request')
    #     if request and hasattr(request, 'user'):
    #         validated_data['user'] = request.user
    #     return super().create(validated_data)

    def create(self, validated_data):
        request = self.context.get('request')
        start_date = validated_data['start_date']
        end_date = validated_data['end_date']
        item_id = validated_data['item'].id

        # check if there is an existing order for the same item in the selected date range
        overlapping_orders = Order.objects.filter(
            item_id=item_id,
            status__in=['pending', 'confirmed', 'issued'],
            is_completed=False,
            start_date__lte=end_date,
            end_date__gte=start_date
        ).values('start_date', 'end_date')

        if overlapping_orders.exists():
            raise ValidationError('There is already an existing order for this item in the selected date range.')

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
