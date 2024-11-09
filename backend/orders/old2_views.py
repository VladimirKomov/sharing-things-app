# from rest_framework import viewsets, status
# from rest_framework.response import Response
# from rest_framework.decorators import action
# from rest_framework.permissions import IsAuthenticated
# from django_filters.rest_framework import DjangoFilterBackend
# from rest_framework.filters import OrderingFilter
# from .models import Order
# from .serializers import OrderSerializer
# from .paginations import OrdersPagination
# import django_filters
#
# class OrderFilter(django_filters.FilterSet):
#     start_date = django_filters.DateFilter(field_name="start_date", lookup_expr='gte')
#     end_date = django_filters.DateFilter(field_name="end_date", lookup_expr='lte')
#
#     class Meta:
#         model = Order
#         fields = ['status', 'start_date', 'end_date']
#
# class OrderViewSet(viewsets.ModelViewSet):
#     queryset = Order.objects.all()
#     serializer_class = OrderSerializer
#     permission_classes = [IsAuthenticated]
#     pagination_class = OrdersPagination
#     filter_backends = [DjangoFilterBackend, OrderingFilter]
#     filterset_class = OrderFilter
#     ordering_fields = ['start_date', 'end_date', 'status']
#
#     def get_queryset(self):
#         # Определяем, какой набор данных возвращать в зависимости от действия
#         if self.action == 'user_orders':
#             return Order.objects.filter(user=self.request.user)
#         elif self.action == 'owner_orders':
#             return Order.objects.filter(item__user=self.request.user)
#         return Order.objects.all()
#
#     def create(self, request, *args, **kwargs):
#         # Логика создания заказа
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         serializer.save(user=request.user)
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#
#     def update(self, request, *args, **kwargs):
#         # Логика обновления заказа
#         instance = self.get_object()
#         user = request.user
#
#         # Проверка прав доступа
#         if user != instance.user and user != instance.item.user:
#             return Response(
#                 {"detail": "You do not have permission to change the status of this order."},
#                 status=status.HTTP_403_FORBIDDEN
#             )
#
#         new_status = request.data.get('status')
#
#         if not self.can_user_update_status(user, instance, new_status):
#             return Response(
#                 {"detail": f"User is not allowed to change status to {new_status}."},
#                 status=status.HTTP_403_FORBIDDEN
#             )
#
#         instance.status = new_status
#         if new_status == 'completed':
#             instance.mark_as_completed()
#         elif new_status == 'canceled':
#             instance.mark_as_canceled()
#         elif new_status == 'rejected':
#             instance.mark_as_rejected()
#
#         instance.save()
#         serializer = self.get_serializer(instance)
#         return Response(serializer.data)
#
#     def can_user_update_status(self, user, order, new_status):
#         status_transitions = {
#             'pending': ['confirmed', 'canceled', 'rejected'],
#             'confirmed': ['issued', 'canceled'],
#             'issued': ['returned'],
#             'returned': ['completed'],
#             'completed': [],
#             'canceled': [],
#             'rejected': [],
#         }
#
#         owner_allowed_statuses = ['confirmed', 'rejected', 'issued', 'completed']
#         creator_allowed_statuses = ['canceled', 'rejected', 'returned']
#
#         current_status = order.status
#         if new_status not in status_transitions.get(current_status, []):
#             return False
#
#         if user == order.item.user:
#             return new_status in owner_allowed_statuses
#         elif user == order.user:
#             return new_status in creator_allowed_statuses
#
#         return False
#
#     @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
#     def user_orders(self, request):
#         queryset = Order.objects.filter(user=request.user)
#         page = self.paginate_queryset(queryset)
#         if page is not None:
#             serializer = self.get_serializer(page, many=True)
#             return self.get_paginated_response(serializer.data)
#         serializer = self.get_serializer(queryset, many=True)
#         return Response(serializer.data)
#
#     @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
#     def owner_orders(self, request):
#         queryset = Order.objects.filter(item__user=request.user)
#         page = self.paginate_queryset(queryset)
#         if page is not None:
#             serializer = self.get_serializer(page, many=True)
#             return self.get_paginated_response(serializer.data)
#         serializer = self.get_serializer(queryset, many=True)
#         return Response(serializer.data)
