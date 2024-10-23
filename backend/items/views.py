from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.permissions import IsAdminUser, IsAuthenticatedOrReadOnly

from common.responses import APIResponse
from items.item_serializers import CategorySerializer, ItemSerializer
from items.models import Category, Item


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        # change only admin
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAdminUser]
        # GET everybody
        else:
            self.permission_classes = [IsAuthenticatedOrReadOnly]
        return super().get_permissions()

    # get all castigates
    def list(self, request, *args, **kwargs):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        response = APIResponse(
            data=serializer.data,
            message="Categories retrieved successfully",
            code=status.HTTP_200_OK
        )
        return response.as_response()

    # get Category by id
    def retrieve(self, request, *args, **kwargs):
        category = self.get_object()
        serializer = CategorySerializer(category)
        response = APIResponse(
            data=serializer.data,
            message="Category retrieved successfully",
            code=status.HTTP_200_OK
        )
        return response.as_response()


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
