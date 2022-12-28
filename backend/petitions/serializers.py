from rest_framework import serializers
from .models import Petition,PetitionAgree
from users.serializers import SimpleUserSerializer
from comments.serializers import CommentSerializer
from categories.serializers import CategorySerializer


class PetitionMainListSerializer(serializers.ModelSerializer):
    total_agrees = serializers.SerializerMethodField()
    total_comments = serializers.SerializerMethodField()
    is_writer = serializers.SerializerMethodField()
    writer = SimpleUserSerializer(read_only=True)

    class Meta:
        model = Petition
        fields = (
            "pk",
            "title",
            "content",
            "total_agrees",
            "total_comments",
            "is_important",
            "writer",
            "is_writer",
            "created_at",
            "petition_start_date",
            "petition_end_date",
        )

    def get_total_agrees(self, petition):
        return petition.count_agree()

    def get_total_comments(self, petition):
        return petition.count_comment()

    def get_is_writer(self, petition):
        request = self.context["request"]
        return petition.writer == request.user


class PetitionTextListSerializer(serializers.ModelSerializer):

    total_agrees = serializers.SerializerMethodField()
    total_comments = serializers.SerializerMethodField()
    is_writer = serializers.SerializerMethodField()
    writer = SimpleUserSerializer(read_only=True)

    class Meta:
        model = Petition
        fields = (
            "pk",
            "is_important",
            "title",
            "writer",
            "total_agrees",
            "total_comments",
            "is_writer",
            "petition_start_date",
            "petition_end_date",
        )

    def get_total_agrees(self, petition):
        return petition.count_agree()

    def get_total_comments(self, petition):
        return petition.count_comment()

    def get_is_writer(self, petition):
        request = self.context["request"]
        return petition.writer == request.user


class PetitionDetailSerializer(serializers.ModelSerializer):

    writer = SimpleUserSerializer(read_only=True)
    comments = CommentSerializer(
        read_only=True,
        many=True,
    )
    category = CategorySerializer(
        read_only=True,
    )
    is_writer = serializers.SerializerMethodField()
    total_agrees = serializers.SerializerMethodField()
    total_comments = serializers.SerializerMethodField()

    class Meta:
        model = Petition
        fields = "__all__"

    def get_total_agrees(self, petition):
        return petition.count_agree()

    def get_total_comments(self, petition):
        return petition.count_comment()

    def get_is_writer(self, petition):
        request = self.context["request"]
        return petition.writer == request.user


class AgreeThisPetitionSerializer(serializers.ModelSerializer):

    total_agrees = serializers.SerializerMethodField()

    class Meta:
        model = Petition
        fields = "__all__"

    def get_total_agrees(self, petition):
        return petition.count_agree()
