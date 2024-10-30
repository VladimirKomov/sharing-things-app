from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .dashboard_views import UserDashboardViewSet

router = DefaultRouter()
router.register(r'items', UserDashboardViewSet, basename='user-dashboard-items')

urlpatterns = [
    path('', include(router.urls)),
]