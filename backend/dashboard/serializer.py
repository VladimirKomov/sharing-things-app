from rest_framework import serializers

from dashboard.models import UserSettings


class UserSettingsSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(required=True, allow_blank=False)
    last_name = serializers.CharField(required=True, allow_blank=False)
    phone_number = serializers.CharField(required=True, allow_blank=False)
    address = serializers.CharField(required=True, allow_blank=False)

    class Meta:
        model = UserSettings
        fields = ['first_name', 'last_name', 'phone_number', 'address', 'latitude', 'longitude']

    def validate(self, data):
        if self.instance and any(value is None or value == "" for key, value in data.items() if
                                 key in ['first_name', 'last_name', 'phone_number', 'address']):
            raise serializers.ValidationError("All required fields must be filled in.")
        return data

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        return {
            'firstName': representation['first_name'],
            'lastName': representation['last_name'],
            'phoneNumber': representation['phone_number'],
            'address': representation['address'],
            'latitude': representation['latitude'],
            'longitude': representation['longitude']
        }

    def to_internal_value(self, data):
        data = {
            'first_name': data.get('firstName'),
            'last_name': data.get('lastName'),
            'phone_number': data.get('phoneNumber'),
            'address': data.get('address'),
            'latitude': data.get('latitude'),
            'longitude': data.get('longitude')
        }
        return super().to_internal_value(data)
