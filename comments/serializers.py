from rest_framework import serializers
from users.serializers import SimpleUserSerializer
from .models import Review


class CommentSerializer(serializers.ModelSerializer):

    user = SimpleUserSerializer(read_only=True)

    class Meta:
        model = Review
        fields = (
            "user",
            "payload",
        )
