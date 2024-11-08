from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from dashboard.permissions import IsOwner
from orders.models import Order
from orders.paginations import OrdersPagination
from orders.serializers import OrderSerializer


class UserOrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    pagination_class = OrdersPagination

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
