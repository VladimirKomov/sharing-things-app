from rest_framework import status, viewsets, permissions

from common.mapper import map_to_api_response_as_resp
from dashboard.dashboard_permissions import IsOwner
from items.item_serializers import ItemSerializer
from items.items_models import Item


class UserDashboardViewSet(viewsets.ModelViewSet):
    serializer_class = ItemSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        # Only current user's items
        return Item.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Set current user as owner
        serializer.save(user=self.request.user)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return map_to_api_response_as_resp(
            data=serializer.data,
            message="Items retrieved successfully",
            code=status.HTTP_200_OK
        )

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return map_to_api_response_as_resp(
            data=serializer.data,
            message="Item retrieved successfully",
            code=status.HTTP_200_OK
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return map_to_api_response_as_resp(
            data=serializer.data,
            message="Item created successfully",
            code=status.HTTP_201_CREATED
        )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return map_to_api_response_as_resp(
            data=serializer.data,
            message="Item updated successfully",
            code=status.HTTP_200_OK
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return map_to_api_response_as_resp(
            message="Item deleted successfully",
            code=status.HTTP_204_NO_CONTENT
        )
