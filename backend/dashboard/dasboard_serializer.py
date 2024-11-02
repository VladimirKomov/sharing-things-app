from rest_framework import serializers

from dashboard.dashboard_models import UserSettings


class UserSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSettings
        fields = ['first_name', 'last_name', 'phone_number', 'address', 'latitude', 'longitude']
