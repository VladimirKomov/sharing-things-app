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
        return request.build_absolute_uri(obj.image.url)


class ItemSerializer(serializers.ModelSerializer):
    images_url = ItemImageSerializer(source='images', many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    owner_address = serializers.CharField(source='user.settings.address', read_only=True)
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        write_only=True
    )

    class Meta:
        model = Item
        fields = ['id', 'name', 'description', 'category', 'price_per_day',
                  'owner_address', 'category_name', 'username', 'images_url']
        extra_kwargs = {
            'category': {'write_only': True}
        }

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # change name's`fields
        data['categoryName'] = data.pop('category_name')
        data['ownerName'] = data.pop('username')
        data['ownerAddress'] = data.pop('owner_address')
        data['imagesUrl'] = data.pop('images_url')
        data['pricePerDay'] = data.pop('price_per_day')
        return data
