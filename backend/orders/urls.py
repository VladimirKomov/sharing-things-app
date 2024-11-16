from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import OrderViewSet, UserOrderViewSet, OwnerOrderViewSet, CreateOrderView, check_item_availability

router = DefaultRouter()
router.register(r'user-orders', UserOrderViewSet, basename='user-order')
router.register(r'owner-orders', OwnerOrderViewSet, basename='owner-order')
router.register(r'update', OrderViewSet, basename='update')

# the full path api/orders/
urlpatterns = [
    # create order
    path('create/', CreateOrderView.as_view(), name='create-order'),
    # check item availability
    path('check-item-availability/', check_item_availability, name='check-item-availability'),
    # user-orders, owner-orders, update
    path('', include(router.urls)),
]
