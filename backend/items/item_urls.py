from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ItemViewSet

# CRUD routes
router = DefaultRouter()
router.register(r'category', CategoryViewSet, basename='category')
router.register(r'item', ItemViewSet, basename='item')

urlpatterns = [
    # the full path api/items
    path('', include(router.urls)),
]