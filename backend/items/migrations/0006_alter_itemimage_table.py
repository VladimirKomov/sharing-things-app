# Generated by Django 5.1.2 on 2024-10-25 12:31

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0005_alter_item_user'),
    ]

    operations = [
        migrations.AlterModelTable(
            name='itemimage',
            table='items_item_images',
        ),
    ]
