from django.contrib import admin

from orders.models import Order


# Register your models here.

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'item', 'created_at', 'updated_at')


