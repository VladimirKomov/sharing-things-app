from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from common.mapper import map_api_error_as_resp, map_to_api_response_as_resp
from common.utils import update_item_rating_cache
from orders.models import Order
from .models import ItemRating, OwnerRating


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def rate_item(request, order_id):
    user = request.user
    rating_value = request.data.get('rating')

    try:
        # check if order exists
        order = Order.objects.filter(id=order_id, user=user, is_completed=True, status='completed').first()
        if not order:
            return map_api_error_as_resp(
                'You can only rate completed orders.',
                code=status.HTTP_400_BAD_REQUEST
            )

        # check if rating already exists
        if ItemRating.objects.filter(order=order, user=user).exists():
            return map_api_error_as_resp(
                'You have already rated this order.',
                code=status.HTTP_400_BAD_REQUEST
            )

        # create rating
        ItemRating.objects.create(order=order, item=order.item, user=user, rating=rating_value)

        # update the cache for the average rating
        update_item_rating_cache(order.item.id)

        return map_to_api_response_as_resp(
            message='Rating submitted successfully.',
            code=status.HTTP_201_CREATED
        )

    except Order.DoesNotExist:
        return map_api_error_as_resp(
            'Order not found.',
            code=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return map_api_error_as_resp(
            f'An error occurred: {str(e)}',
            code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def rate_owner(request, order_id):
    user = request.user
    rating_value = request.data.get('rating')

    try:
        order = Order.objects.filter(id=order_id, user=user, is_completed=True, status='completed').first()
        if not order:
            return map_api_error_as_resp('You can only rate completed orders.',
                                         code=status.HTTP_400_BAD_REQUEST)

        # check if rating already exists
        if OwnerRating.objects.filter(order=order, user=user).exists():
            return map_api_error_as_resp('You have already rated this order.',
                                         code=status.HTTP_400_BAD_REQUEST)

        # create rating
        OwnerRating.objects.create(order=order, owner=order.item.user, user=user, rating=rating_value)

        return map_to_api_response_as_resp(message='Owner rating submitted successfully.', code=status.HTTP_201_CREATED)

    except Order.DoesNotExist:
        return map_api_error_as_resp('Order not found.',
                                     code=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return map_api_error_as_resp(
            "An error occurred",
            code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            details={"error": str(e)}
        )
