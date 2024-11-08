from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from dashboard.permissions import IsOwner
from .models import Order
from .paginations import OrdersPagination
from .serializers import OrderSerializer


class UserOrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    pagination_class = OrdersPagination  # Custom pagination class

    def get_queryset(self):
        # Limit the selection to only the current user's orders
        return Order.objects.filter(user=self.request.user)
