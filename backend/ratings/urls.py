from django.urls import path
from .views import rate_item, rate_owner

urlpatterns = [
    path('rate-item/<int:order_id>/', rate_item, name='rate_item'),
    path('rate-owner/<int:order_id>/', rate_owner, name='rate_owner')
]
