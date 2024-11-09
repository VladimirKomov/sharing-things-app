from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserOrderViewSet, OwnerOrderViewSet, OrderViewSet

router = DefaultRouter()
router.register(r'user', UserOrderViewSet, basename='order')
router.register(r'owner', OwnerOrderViewSet, basename='owner-orders')
router.register(r'update', OrderViewSet, basename='update')

urlpatterns = [
    # the full path api/orders from DefaultRouter
    path('', include(router.urls)),
]
