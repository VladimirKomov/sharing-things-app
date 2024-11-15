from datetime import timedelta

from django.core.cache import cache
from django.db.models import Avg

from common.logger import logger
from orders.models import Order
from ratings.models import ItemRating


# get booked dates from orders for a specific item
def get_booked_dates_for_item(item_id):
    orders = Order.objects.filter(
        item_id=item_id,
        status__in=['pending', 'confirmed', 'issued'],
        is_completed=False
    ).values('start_date', 'end_date')

    booked_dates = []
    for order in orders:
        start_date = order['start_date']
        end_date = order['end_date']
        current_date = start_date
        while current_date <= end_date:
            booked_dates.append(current_date)
            current_date += timedelta(days=1)

    return booked_dates


# get average rating for a specific item from cache
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
        # if cache access fails, log the error and try to get the rating from the database
        logger.error(f"Error accessing cache for item {item_id}: {e}")

        # try to get the rating from the database
        try:
            average_rating = ItemRating.objects.filter(item_id=item_id).aggregate(Avg('rating'))['rating__avg']
            average_rating = average_rating if average_rating else 0.0
            return average_rating
        # full of pussy
        except Exception as db_exception:
            logger.error(f"Error accessing database for item {item_id}: {db_exception}")
            return 0.0


# update average rating for a specific item in cache
def update_item_rating_cache(item_id):
    cache_key = f'item_{item_id}_average_rating'
    average_rating = ItemRating.objects.filter(item_id=item_id).aggregate(Avg('rating'))['rating__avg']
    average_rating = average_rating if average_rating else 0.0
    cache.set(cache_key, average_rating, timeout=3600)  # 1 hour
