from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from common.mapper import map_api_error_as_resp, map_to_api_response_as_resp
from items.models import Item
from orders.models import Order
from .models import ItemRating


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def rate_item(request, item_id):
    user = request.user
    rating_value = request.data.get('rating')

    try:
        if not Order.objects.filter(item_id=item_id, user=user, is_completed=True, status='completed').exists():
            return map_api_error_as_resp(
                'You can only rate items for completed orders.',
                code=status.HTTP_400_BAD_REQUEST
            )

        item = Item.objects.get(id=item_id)
        ItemRating.objects.create(item=item, user=user, rating=rating_value)

        return map_to_api_response_as_resp(
            message='Rating submitted successfully.',
            code=status.HTTP_201_CREATED
        )

    except Item.DoesNotExist:
        return map_api_error_as_resp(
            'Item not found.',
            code=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return map_api_error_as_resp(
            f'An error occurred: {str(e)}',
            code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
