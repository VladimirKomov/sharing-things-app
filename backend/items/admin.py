from django.contrib import admin

from .models import Category, Item, ItemImage


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')


@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'description')


@admin.register(ItemImage)
class ItemImageAdmin(admin.ModelAdmin):
    list_display = ('item', 'image')
