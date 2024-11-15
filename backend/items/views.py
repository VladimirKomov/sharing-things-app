from datetime import datetime

import django_filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, status
from rest_framework.permissions import IsAdminUser, IsAuthenticatedOrReadOnly, AllowAny

from common.mapper import map_to_api_response_as_resp
from common.utils import get_booked_dates_for_item, get_item_average_rating
from items.models import Category, Item
from items.paginations import ItemsPagination
from items.serializers import CategorySerializer, ItemSerializer


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


class ItemDateFilter(django_filters.FilterSet):
    start_date = django_filters.DateFilter(field_name='orders__start_date', lookup_expr='gte')
    end_date = django_filters.DateFilter(field_name='orders__end_date', lookup_expr='lte')

    class Meta:
        model = Item
        fields = ['start_date', 'end_date']


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all().order_by('id')  # sort by id
    serializer_class = ItemSerializer
    pagination_class = ItemsPagination
    # access is open
    permission_classes = [AllowAny]
    # filter by date
    filter_backends = [DjangoFilterBackend]
    filterset_class = ItemDateFilter

    def get_queryset(self):
        queryset = self.queryset
        category_slug = self.request.query_params.get('category')

        # if get param "category"
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)

        # if get param "start_date" and "end_date"
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        if start_date and end_date:
            try:
                # check date format
                start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
                end_date = datetime.strptime(end_date, '%Y-%m-%d').date()

                if start_date > end_date:
                    raise ValueError("Start date must be before or equal to end date.")
            except ValueError as e:
                # if date format is invalid
                raise ValueError(f"Invalid date format or logic: {e}")
            print(f"start_date: {start_date}, end_date: {end_date}")
            # get all booked items
            booked_items = queryset.filter(
                orders__start_date__lte=end_date,
                orders__end_date__gte=start_date
            ).exclude(
                orders__is_completed=True,
                orders__status__in=['canceled', 'rejected']
            ).distinct()

            # exclude booked items
            queryset = queryset.exclude(id__in=booked_items.values('id'))

        return queryset

    def retrieve(self, request, *args, **kwargs):
        # get by id
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        # get average rating
        item_data = serializer.data
        item_data['averageRating'] = get_item_average_rating(instance.id)

        # Get booked dates for the item
        item_data['bookedDates'] = get_booked_dates_for_item(instance.id)

        return map_to_api_response_as_resp(
            item_data,
            "Item retrieved successfully",
            status.HTTP_200_OK
        )

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        items_data = []

        # get average rating for each item
        for item in queryset:
            item_data = self.get_serializer(item).data
            item_data['averageRating'] = get_item_average_rating(item.id)
            items_data.append(item_data)

        # Pagination
        page = self.paginate_queryset(items_data)
        if page is not None:
            return self.get_paginated_response(page)

        # Without pagination
        return map_to_api_response_as_resp(
            items_data,
            "Items retrieved successfully",
            code=status.HTTP_200_OK
        )
