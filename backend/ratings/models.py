from django.db import models

from items.models import Item
from django.contrib.auth.models import User

from orders.models import Order


class ItemRating(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='item_rating')
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='ratings')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='item_ratings')
    rating = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Limit on one rating from one user
        unique_together = ('order', 'user')


class OwnerRating(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='owner_rating')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owner_ratings')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owner_rating_user')
    rating = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('order', 'user')


