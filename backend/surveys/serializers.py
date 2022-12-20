from rest_framework import serializers
from .models import Survey,SurveyParticipate
from users.serializers import SimpleUserSerializer
from categories.serializers import CategorySerializer

class SurveyParticipateSerializer(serializers.ModelSerializer):

    class Meta:
        model = SurveyParticipate
        fields = (
            "participant",
            "survey_sheet",
        )


class SurveyMainListSerializer(serializers.ModelSerializer):
    total_surveys = serializers.SerializerMethodField()
    is_writer = serializers.SerializerMethodField()

    class Meta:
        model = Survey
        fields = (
            "pk",
            "title",
            "content",
            "is_writer",
            "participate",
            "on_processing",
            "total_surveys",
        )

    def get_on_processing(self, petition):
        return petition.on_processing()

    def get_is_writer(self, petition):
        request = self.context["request"]
        return petition.writer == request.user
