from django.contrib import admin

from ratings.models import ItemRating, OwnerRating


@admin.register(ItemRating)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order', 'item', 'user', 'rating', 'created_at')


@admin.register(OwnerRating)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order', 'owner', 'user', 'rating', 'created_at')

