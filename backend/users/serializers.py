from rest_framework.serializers import ModelSerializer
from .models import User


class SimpleUserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = (
            "name",
            "username",
            "major",
        )


class PrivateUserSerializer(ModelSerializer):
    class Meta:
        model = User
        exclude = (
            "password",
            "is_superuser",
            "is_staff",
            "is_active",
            "is_council",
            "id",
            "first_name",
            "last_name",
            "user_permissions",
        )
