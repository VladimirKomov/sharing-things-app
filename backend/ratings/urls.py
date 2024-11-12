from django.urls import path
from .views import rate_item

urlpatterns = [
    path('rate-item/<int:item_id>/', rate_item, name='rate_item'),
]
