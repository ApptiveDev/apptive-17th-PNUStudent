from rest_framework import serializers
from .models import Inquiry, InquiryAnswer
from users.serializers import SimpleUserSerializer
from comments.serializers import CommentSerializer
from categories.serializers import CategorySerializer


class InquiryListSerializer(serializers.ModelSerializer):

    writer = SimpleUserSerializer(read_only=True)
    is_writer = serializers.SerializerMethodField()

    class Meta:
        model = Inquiry
        fields = (
            "pk",
            "is_important",
            "is_answered",
            "is_writer",
            "title",
            "writer",
        )


    def get_is_writer(self, petition):
        request = self.context["request"]
        return petition.writer == request.user


class InquiryDetailSerializer(serializers.ModelSerializer):

    writer = SimpleUserSerializer(read_only=True)
    category = CategorySerializer(
        read_only=True,
    )
    is_writer = serializers.SerializerMethodField()


    class Meta:
        model = Inquiry
        fields = (
            "pk",
            "category",
            "is_important",
            "is_answered",
            "is_writer",
            "title",
            "content",
            "writer",
            "created_at",
            "hits"
        )


    def get_is_writer(self, inquiry):
        request = self.context["request"]
        return inquiry.writer == request.user

class InquiryAnswerDetailSerializer(serializers.ModelSerializer):

    inquiry_connected = serializers.SerializerMethodField()
    
    class Meta:
        model = Inquiry
        fields = "__all__"

    def get_inquiry_connected(self,inquiry):
        request = self.context["request"]
        return inquiry.id