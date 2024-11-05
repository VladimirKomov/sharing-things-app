from rest_framework import status, viewsets, generics
from rest_framework.permissions import IsAuthenticated

from common.mapper import map_to_api_response_as_resp
from dashboard.dasboard_serializer import UserSettingsSerializer
from dashboard.dashboard_models import UserSettings
from dashboard.dashboard_permissions import IsOwner
from items.item_serializers import ItemSerializer
from items.items_models import Item
from items.items_pagination import ItemsPagination


# Items view
class UserDashboardViewSet(viewsets.ModelViewSet):
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    # use paginator
    pagination_class = ItemsPagination

    def get_queryset(self):
        # Only current user's items
        queryset = Item.objects.filter(user=self.request.user)
        # category filter
        category_slug = self.request.query_params.get('category')

        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        # order by id
        return queryset.order_by('id')

    def perform_create(self, serializer):
        # Set current user as owner
        serializer.save(user=self.request.user)

    def list(self, request, *args, **kwargs):
        queryset = self.paginate_queryset(self.get_queryset())
        if queryset is not None:
            serializer = self.get_serializer(queryset, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(self.get_queryset(), many=True)
        return map_to_api_response_as_resp(
            data=serializer.data,
            message="Items retrieved successfully",
            code=status.HTTP_200_OK
        )

    # get item by id
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


# User setting view
class UserSettingsView(generics.RetrieveUpdateAPIView):
    queryset = UserSettings.objects.all()
    serializer_class = UserSettingsSerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def get_object(self):
        # return current setting
        user_settings, created = UserSettings.objects.get_or_create(user=self.request.user)
        return user_settings

    def perform_update(self, serializer):
        # update current setting
        serializer.save(user=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)
        return map_to_api_response_as_resp(
            data=response.data,
            message="Settings retrieved successfully",
            code=status.HTTP_200_OK
        )
