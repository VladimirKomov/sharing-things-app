import django_filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, status
from rest_framework.filters import OrderingFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from common.mapper import map_to_api_response_as_resp
from dashboard.permissions import IsOwner
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

        # Проверка, что пользователь — владелец вещи или создатель заказа
        if user != instance.user and user != instance.item.user:
            return Response(
                {"detail": "You do not have permission to change the status of this order."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Проверка допустимости перехода статуса
        current_status = instance.status
        new_status = request.data.get('status')

        if not self.can_transition_to_status(current_status, new_status):
            return Response(
                {"detail": f"Transition from {current_status} to {new_status} is not allowed."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Обновление статуса
        instance.status = new_status
        instance.save()

        serializer = self.get_serializer(instance)
        return map_to_api_response_as_resp(
            serializer.data
        )

    def can_transition_to_status(self, current_status, new_status):
        # Определение допустимых переходов статусов
        status_transitions = {
            'pending': ['confirmed', 'canceled'],
            'confirmed': ['issued', 'canceled'],
            'issued': ['returned'],
            'returned': ['completed'],
            'completed': [],
            'canceled': [],
            'rejected': [],
        }
        return new_status in status_transitions.get(current_status, [])
