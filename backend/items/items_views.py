from rest_framework import viewsets, status
from rest_framework.permissions import IsAdminUser, IsAuthenticatedOrReadOnly, AllowAny

from common.mapper import map_to_api_response_as_resp
from items.item_serializers import CategorySerializer, ItemSerializer
from items.items_models import Category, Item
from items.items_pagination import ItemsPagination


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    # access is open
    permission_classes = [AllowAny]

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
        return map_to_api_response_as_resp(
            data=serializer.data,
            message="Categories retrieved successfully",
            code=status.HTTP_200_OK
        )

    # get Category by id
    def retrieve(self, request, *args, **kwargs):
        category = self.get_object()
        serializer = CategorySerializer(category)
        return map_to_api_response_as_resp(
            data=serializer.data,
            message="Category retrieved successfully",
            code=status.HTTP_200_OK
        )


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all().order_by('id')  # sort by id
    serializer_class = ItemSerializer
    pagination_class = ItemsPagination
    # access is open
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = self.queryset
        category_slug = self.request.query_params.get('category')

        # if get param "category"
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)

        return queryset

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()  # Получаем элемент по id
        serializer = self.get_serializer(instance)
        return map_to_api_response_as_resp(
            serializer.data,
            "Item retrieved successfully",
            status.HTTP_200_OK
        )
