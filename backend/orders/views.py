import django_filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import OrderingFilter

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
