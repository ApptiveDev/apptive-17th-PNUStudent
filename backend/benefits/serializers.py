from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from .models import Benefit
from users.serializers import SimpleUserSerializer
from categories.serializers import CategorySerializer
from medias.serializers import PhotoSerializer


class BenefitListSerializer(ModelSerializer):

    photos = PhotoSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Benefit
        fields = (
            "pk",
            "title",
            "photos",
            "writer",
            "is_writer",
            "writer",
            "is_important",
        )

    def get_is_writer(self, benefit):
        # dynamic field 동적필드
        request = self.context["request"]
        return benefit.writer == request.user


class BenefitDetailSerializer(ModelSerializer):
    writer = SimpleUserSerializer(read_only=True)
    category = CategorySerializer(
        read_only=True,
    )
    is_writer = serializers.SerializerMethodField()
    photos = PhotoSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Benefit
        fields = "__all__"

    def get_is_writer(self, benefit):
        # dynamic field 동적필드
        request = self.context["request"]
        return benefit.writer == request.user
