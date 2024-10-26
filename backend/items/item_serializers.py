from rest_framework import serializers

from .items_models import Category, Item, ItemImage


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']


class ItemImageSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = ItemImage
        fields = ['url']

    def get_url(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.image.url)


class ItemSerializer(serializers.ModelSerializer):
    images_url = ItemImageSerializer(source='images', many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Item
        fields = ['id', 'name', 'description', 'category_name', 'username', 'images_url']
