from rest_framework import serializers
from .models import Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        # 수동으로 추가하기 fields = ("name","kind",)
        fields = (
            "pk",
            "name",
            "kind",
        )
