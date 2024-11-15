import django_filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, status, generics
from rest_framework.decorators import api_view
from rest_framework.filters import OrderingFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from common.mapper import map_to_api_response_as_resp
from dashboard.permissions import IsOwner
from items.models import Item
from orders.models import Order
from orders.paginations import OrdersPagination
from orders.serializers import OrderSerializer


class OrderFilter(django_filters.FilterSet):
    start_date = django_filters.DateFilter(field_name="start_date", lookup_expr='gte')
    end_date = django_filters.DateFilter(field_name="end_date", lookup_expr='lte')

    class Meta:
        model = Order
        fields = ['status', 'start_date', 'end_date']


class UserOrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    pagination_class = OrdersPagination
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = OrderFilter
    ordering_fields = ['start_date', 'end_date', 'status']

    def get_queryset(self):
        queryset = Order.objects.filter(user=self.request.user)
        filtered_queryset = self.filter_queryset(queryset)
        return filtered_queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class OwnerOrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = OrdersPagination
    filter_backends = [DjangoFilterBackend]
    filterset_class = OrderFilter
    ordering_fields = ['start_date', 'end_date', 'status']

    def get_queryset(self):
        # filter by owner
        return Order.objects.filter(item__user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user

        # Verification that the user is the owner of the item or the creator of the order
        if user != instance.user and user != instance.item.user:
            return Response(
                {"detail": "You do not have permission to change the status of this order."},
                status=status.HTTP_403_FORBIDDEN
            )

        new_status = request.data.get('status')

        # Checking the validity of the user's status and rights transition
        if not self.can_user_update_status(user, instance, new_status):
            return Response(
                {"detail": f"User is not allowed to change status to {new_status}."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Status Update
        instance.status = new_status
        if new_status == 'completed':
            instance.mark_as_completed()
        elif new_status == 'canceled':
            instance.mark_as_canceled()
        elif new_status == 'rejected':
            instance.mark_as_rejected()

        instance.save()

        serializer = self.get_serializer(instance)
        return map_to_api_response_as_resp(serializer.data)

    def can_user_update_status(self, user, order, new_status):
        # Determination of available status transitions
        status_transitions = {
            'pending': ['confirmed', 'canceled', 'rejected'],
            'confirmed': ['issued', 'canceled'],
            'issued': ['returned'],
            'returned': ['completed'],
            'completed': [],
            'canceled': [],
            'rejected': [],
        }

        # Determining which statuses the owner of the item can set
        owner_allowed_statuses = ['confirmed', 'rejected', 'issued', 'completed']

        # Determining which statuses the creator of the order can set
        creator_allowed_statuses = ['canceled', 'rejected', 'returned']

        # Checking the status transition
        current_status = order.status
        if new_status not in status_transitions.get(current_status, []):
            return False

        # Checking user rights
        if user == order.item.user:
            # The user is the owner of the item
            return new_status in owner_allowed_statuses
        elif user == order.user:
            # The user is the creator of the order
            return new_status in creator_allowed_statuses

        return False


class CreateOrderView(generics.CreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        user = request.user
        item_id = request.data.get('itemId')

        # Checking the existence of a thing
        try:
            item = Item.objects.get(id=item_id)
        except Item.DoesNotExist:
            return Response(
                {"detail": "Item not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Checking that the user does not create an order for his item
        if item.user == user:
            return Response(
                {"detail": "You cannot create an order for your own item."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Creating an order
        data = request.data.copy()
        data['user'] = user.id
        data['item'] = item.id

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return map_to_api_response_as_resp(serializer.data, code=status.HTTP_201_CREATED)


# The function checks the availability of the item for the specified period
@api_view(['GET'])
def check_item_availability(request):
    item_id = request.query_params.get('itemId')
    start_date = request.query_params.get('startDate')
    end_date = request.query_params.get('endDate')

    # Checking the validity of the parameters
    if not item_id or not start_date or not end_date:
        return map_to_api_response_as_resp({'available': False, 'message': 'Invalid parameters'}, code=400)

    # Checking the existence of the item
    overlapping_orders = Order.objects.filter(
        item_id=item_id,
        # We take into account only active orders
        status__in=['pending', 'confirmed', 'issued'],
        # Incomplete orders only
        is_completed=False,
        start_date__lte=end_date,
        end_date__gte=start_date
    )

    if overlapping_orders.exists():
        return map_to_api_response_as_resp({'available': False})

    return map_to_api_response_as_resp({'available': True})

# @api_view(['GET'])
# def fetch_item_with_booked_dates(request):
#     item_id = request.query_params.get('itemId')
#
#     # check itemId
#     if not item_id:
#         return map_to_api_response_as_resp({'error': 'Item ID is required'}, code=400)
#
#     try:
#         # get item
#         item = Item.objects.get(id=item_id)
#         item_serializer = ItemSerializer(item, context={'request': request})
#
#         # get average rating for the item
#         average_rating = get_item_average_rating(item_id)
#         item_data = item_serializer.data
#         item_data['averageRating'] = average_rating
#
#         # get orders itemId
#         orders = Order.objects.filter(
#             item_id=item_id,
#             status__in=['pending', 'confirmed', 'issued'],
#             is_completed=False
#         ).values('start_date', 'end_date')
#
#         # get booked dates
#         booked_dates = []
#         for order in orders:
#             start_date = order['start_date']
#             end_date = order['end_date']
#             current_date = start_date
#             while current_date <= end_date:
#                 booked_dates.append(current_date)
#                 current_date += timedelta(days=1)
#         # return response
#
#         return map_to_api_response_as_resp({
#             'item': item_data,
#             'bookedDates': booked_dates
#         }, code=200)
#
#     except Item.DoesNotExist:
#         return map_api_error_as_resp('Item not found', code=404)
#     except Exception as e:
#         return map_api_error_as_resp('Something wrong', code=500, details={'error': str(e)})
