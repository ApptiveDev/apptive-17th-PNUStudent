from rest_framework import serializers
from users.serializers import SimpleUserSerializer
from .models import Comment


class CommentSerializer(serializers.ModelSerializer):

    user = SimpleUserSerializer(
        read_only = True
    )

    class Meta:
        model = Comment
        fields = (
            "user",
             "payload",
             )
