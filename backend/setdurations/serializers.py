from django.utils import timezone
from rest_framework import serializers
from .models import SetDurations


class CreateSurveySerializer(serializers.ModelSerializer):

    start_date = serializers.DateField()
    end_date = serializers.DateField()

    class Meta:
        model = SetDurations
        fields = (
            "start_date",
            "end_date",
        )

    def validate_start_date(self, value):
        now = timezone.localtime(timezone.now()).date()
        if now > value:
            raise serializers.ValidationError("지나간 날부터 설문조사 시작일자 설정을 할 수 없습니다.")
        return value

    def validate_end_date(self, value):
        now = timezone.localtime(timezone.now()).date()
        if now > value:
            raise serializers.ValidationError("지나간 날부터 설문조사 종료일자 설정을 할 수 없습니다.")
        return value

    def validate(self, data):
        survey = self.context.get("survey")
        if data["end_date"] <= data["start_date"]:
            raise serializers.ValidationError(
                "설문조사 종료일자는 설문조사 시작일자 보다 빠를수 없습니다."
            )
        return data


class PublicSurveySerializer(serializers.ModelSerializer):
    class Meta:
        model = SetDurations
        fields = (
            "pk",
            "start_date",
            "end_date",
            "in_a_day_date",
        )