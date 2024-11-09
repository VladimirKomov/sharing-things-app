from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserOrderViewSet, OwnerOrderViewSet

router = DefaultRouter()
router.register(r'user-orders', UserOrderViewSet, basename='order')
router.register(r'owner-orders', OwnerOrderViewSet, basename='owner-orders')

urlpatterns = [
    # the full path api/orders from DefaultRouter
    path('', include(router.urls)),
]
