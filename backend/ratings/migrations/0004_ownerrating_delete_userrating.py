# Generated by Django 5.1.2 on 2024-11-13 10:42

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0004_remove_order_result'),
        ('ratings', '0003_alter_userrating_unique_together_userrating_order_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='OwnerRating',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rating', models.FloatField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('order', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='owner_rating', to='orders.order')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='owner_ratings', to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='owner_rating_user', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('order', 'user')},
            },
        ),
        migrations.DeleteModel(
            name='UserRating',
        ),
    ]
