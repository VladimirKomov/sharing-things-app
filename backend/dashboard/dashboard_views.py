from rest_framework import viewsets, permissions

from items.item_serializers import ItemSerializer
from items.items_models import Item


class UserDashboardViewSet(viewsets.ModelViewSet):
    serializer_class = ItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # only current user
        return Item.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # current user as owner
        serializer.save(user=self.request.user)
