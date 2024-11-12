from django.db import models

from items.models import Item
from django.contrib.auth.models import User


class ItemRating(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='ratings')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Limit on one rating from one user
        unique_together = ('item', 'user')

class UserRating(models.Model):
    rated_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_ratings')
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='given_ratings')
    rating = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Limit on one rating from one user
        unique_together = ('rated_user', 'reviewer')
