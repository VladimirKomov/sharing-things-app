import os
import uuid

from django.contrib.auth.models import User
from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    # for url paths
    slug = models.SlugField(max_length=255, unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super(Category, self).save(*args, **kwargs)

    def __str__(self):
        return self.name


class Item(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price_per_day = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey('Category', on_delete=models.PROTECT, null=True, related_name='items')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='items')

    def __str__(self):
        return self.name

    def is_free(self):
        return self.price_per_day == 0


class ItemImage(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='images')

    # create unique name fot the file
    def generate_unique_image_path(self, filename):
        extension = filename.split('.')[-1]
        unique_filename = f"{uuid.uuid4()}.{extension}"
        return os.path.join('items/', unique_filename)

    image = models.ImageField(upload_to=generate_unique_image_path)

    def __str__(self):
        return f"Image for {self.item.name}"

    class Meta:
        db_table = 'items_item_images'


