import os
import uuid

from django.contrib.auth.models import User
from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=False)

    def __str__(self):
        return self.name


class Item(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    category = models.ForeignKey('Category', on_delete=models.PROTECT, null=True, related_name='items')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='items')

    def __str__(self):
        return self.name


class ItemImage(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='images')

    #create unique name fot the file
    def generate_unique_image_path(self, filename):
        extension = filename.split('.')[-1]
        unique_filename = f"{uuid.uuid4()}.{extension}"
        return os.path.join('items/', unique_filename)

    image = models.ImageField(upload_to=generate_unique_image_path)

    def __str__(self):
        return f"Image for {self.item.name}"

    class Meta:
        db_table = 'items_item_images'
