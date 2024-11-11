from django.urls import path, include
from rest_framework.routers import DefaultRouter

from items.views import CategoryViewSet, ItemViewSet

# CRUD routes
router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'items', ItemViewSet, basename='item')

urlpatterns = [
    # the full path api/items/
    path('', include(router.urls)),
]