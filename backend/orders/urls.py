from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserOrderViewSet

router = DefaultRouter()
router.register(r'orders', UserOrderViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
