from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, UserOrderViewSet, OwnerOrderViewSet, CreateOrderView

router = DefaultRouter()
router.register(r'user-orders', UserOrderViewSet, basename='user-order')
router.register(r'owner-orders', OwnerOrderViewSet, basename='owner-order')
router.register(r'update', OrderViewSet, basename='update')

urlpatterns = [
    path('create/', CreateOrderView.as_view(), name='create-order'),  # Путь для создания заказа
    path('', include(router.urls)),  # Остальные пути
]

