from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserOrderViewSet

router = DefaultRouter()
router.register(r'', UserOrderViewSet, basename='order')

urlpatterns = [
    # the full path api/orders from DefaultRouter
    path('', include(router.urls)),
]
