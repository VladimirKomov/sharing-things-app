from django.db import models
from django.db.models import Avg
from django.core.cache import cache

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


def get_item_average_rating(item_id):
    cache_key = f'item_{item_id}_average_rating'
    try:
        average_rating = cache.get(cache_key)
        if average_rating is None:
            average_rating = ItemRating.objects.filter(item_id=item_id).aggregate(Avg('rating'))['rating__avg']
            average_rating = average_rating if average_rating else 0.0
            cache.set(cache_key, average_rating, timeout=3600)  # 1 hour
        print('average_rating:', average_rating)
        return average_rating
    except Exception as e:
        return 0.0


def update_item_rating_cache(item_id):
    cache_key = f'item_{item_id}_average_rating'
    average_rating = ItemRating.objects.filter(item_id=item_id).aggregate(Avg('rating'))['rating__avg']
    average_rating = average_rating if average_rating else 0.0
    cache.set(cache_key, average_rating, timeout=3600)  # 1 hour

