from rest_framework import serializers

from .models import Category, Item, ItemImage


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'slug']


class ItemImageSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = ItemImage
        fields = ['id', 'url']

    def get_url(self, obj):
        request = self.context.get('request')
        # mabye the request is missing because the serializer is used in a different context
        if request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url


class ItemSerializer(serializers.ModelSerializer):
    images_url = ItemImageSerializer(source='images', many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    owner_address = serializers.SerializerMethodField()
    owner = serializers.SerializerMethodField()
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        write_only=True
    )

    class Meta:
        model = Item
        fields = ['id', 'name', 'description', 'category', 'price_per_day',
                  'owner_address', 'category_name', 'username', 'owner', 'user_id', 'images_url']
        extra_kwargs = {
            'category': {'write_only': True}
        }

    def get_owner_address(self, obj):
        # Checking if the user has related data in UserSettings
        if obj.user and hasattr(obj.user, 'settings') and obj.user.settings:
            return obj.user.settings.address
        return None

    def get_owner(self, obj):
        # Checking if the user has related data in UserSettings
        if obj.user and hasattr(obj.user, 'settings') and obj.user.settings:
            return {
                'id': obj.user.id,
                'name': obj.user.username,
                'address': obj.user.settings.address,
                'lat': obj.user.settings.latitude,
                'lng': obj.user.settings.longitude,
            }
        return {
            'id': obj.user.id,
            'name': obj.user.username,
            'address': None,
            'lat': None,
            'lng': None,
        }

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # change name's`fields
        data['categoryName'] = data.pop('category_name')
        data['ownerName'] = data.pop('username')
        data['ownerId'] = data.pop('user_id')
        data['ownerAddress'] = data.pop('owner_address')
        data['imagesUrl'] = data.pop('images_url')
        data['pricePerDay'] = data.pop('price_per_day')
        return data
