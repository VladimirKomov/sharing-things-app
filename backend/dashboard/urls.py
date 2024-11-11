from django.urls import path, include
from rest_framework.routers import DefaultRouter

from dashboard.views import UserDashboardViewSet, UserSettingsView

router = DefaultRouter()
router.register(r'items', UserDashboardViewSet, basename='user-dashboard-items')

urlpatterns = [
    path('', include(router.urls)),
    path('settings/', UserSettingsView.as_view(), name='user-settings'),
]
