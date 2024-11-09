from django.contrib.auth.models import User
from django.db import models

from items.models import Item


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('canceled', 'Canceled'),
        ('confirmed', 'Confirmed'),
        ('rejected', 'Rejected'),
        ('issued', 'Issued'),
        ('returned', 'Returned'),
        ('completed', 'Completed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    start_date = models.DateField()
    end_date = models.DateField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # field for marking completed orders
    is_completed = models.BooleanField(default=False)

    class Meta:
        ordering = ['start_date']

    def __str__(self):
        return f"Order {self.id} for {self.item.name} by {self.user.username}"

    def mark_as_completed(self):
        """Marks the order as completed and updates the status."""
        if self.status == 'completed':
            self.is_completed = True
            self.save()

    def mark_as_canceled(self):
        """Marks the order as cancelled and completes it."""
        if self.status == 'canceled':
            self.is_completed = True
            self.save()

    def mark_as_rejected(self):
        """Marks the order as rejected and completes it."""
        if self.status == 'rejected':
            self.is_completed = True
            self.save()
