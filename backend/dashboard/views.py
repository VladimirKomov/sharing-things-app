import json
from urllib.parse import urlparse

from django.core.exceptions import ValidationError
from django.db import transaction
from rest_framework import status, viewsets, generics
from rest_framework.permissions import IsAuthenticated

from common.mapper import map_to_api_response_as_resp
from dashboard.models import UserSettings
from dashboard.permissions import IsOwner
from dashboard.serializer import UserSettingsSerializer
from items.models import Item, ItemImage
from items.paginations import ItemsPagination
from items.serializers import ItemSerializer


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

    def handle_images(self, item, images, max_images=5, max_size_mb=2):
        """
        Handle image uploading and saving with restrictions.
        :param item: Item instance to associate images with.
        :param images: List of images to be uploaded.
        :param max_images: Maximum number of images allowed.
        :param max_size_mb: Maximum size of each image in megabytes.
        """
        # check count images
        if len(images) > max_images:
            raise ValidationError(f"Maximum of {max_images} images are allowed.")

        for image in images:
            # check size
            if image.size > max_size_mb * 1024 * 1024:
                raise ValidationError(f"Each image must be smaller than {max_size_mb} MB.")

            # save
            ItemImage.objects.create(item=item, image=image)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            # the first create the item
            self.perform_create(serializer)

            # the second save image
            item = serializer.instance
            images = request.FILES.getlist('images')

            self.handle_images(item, images)

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

        item = serializer.save(user=self.request.user)

        # get current images
        current_images = request.data.get('currentImages', '[]')
        if isinstance(current_images, str):
            try:
                current_images = json.loads(current_images)
            except json.JSONDecodeError:
                raise ValidationError("Invalid format for currentImages. Expected a JSON array of URLs.")

        # Converting URLs
        current_images_relative = [self.extract_relative_path(url) for url in current_images]

        # Deleting old images that are missing from the list of current images
        for image in instance.images.all():
            if image.image.name not in current_images_relative:
                image.delete()

        # new images
        new_images = request.FILES.getlist('images')
        self.handle_images(item, new_images)

        self.perform_update(serializer)
        return map_to_api_response_as_resp(
            data=serializer.data,
            message="Item updated successfully",
            code=status.HTTP_200_OK
        )

    def extract_relative_path(self, full_url):
        parsed_url = urlparse(full_url)
        path = parsed_url.path
        if path.startswith('/public/'):
            path = path[len('/public/'):]
        return path.lstrip('/')

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        # save id
        item_id = instance.id
        self.perform_destroy(instance)
        return map_to_api_response_as_resp(
            data={'id': item_id},  # return id element after destroy
            message="Item deleted successfully",
            code=status.HTTP_200_OK
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

    def update(self, request, *args, **kwargs):
        # update setting with validation
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        # return response
        return map_to_api_response_as_resp(
            data=serializer.data,
            message="Settings updated successfully",
            code=status.HTTP_200_OK
        )
