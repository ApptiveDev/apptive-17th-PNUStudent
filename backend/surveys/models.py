from django.db import models
from common.models import CommonModel


class Survey(CommonModel):

    title = models.CharField(
        max_length=300,
        default="",
    )
    content = models.CharField(
        max_length=3000,
        default="",
    )
    writer = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        related_name="surveys",
    )
    participate = models.ManyToManyField(
        "surveys.SurveyParticipate",
        related_name="surveys",
    )
    category = models.ForeignKey(
        "categories.Category",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="surveys",
    )

    on_processing = models.BooleanField(
        default=True,
    )

    is_over = models.BooleanField(
        default=False,
    )

    def __str__(self) -> str:
        return self.title

    def count_participate(survey):
        return survey.participate.count()


class SurveyParticipate(CommonModel):
    """Like Model Definition"""

    participant = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        related_name="survey_participate",
    )
    survey_sheet = models.TextField(
        null = True,
    )

    def __str__(self):
        return f"{self.survey.title}"
