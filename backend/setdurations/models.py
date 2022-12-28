from django.db import models
from common.models import CommonModel

class SetDurations(CommonModel):

    """For Survey Period"""

    class ApplyModelKindChoices(models.TextChoices):
        SURVEY = "survey", "설문 조사"

    kind = models.CharField(
        max_length=15,
        choices=ApplyModelKindChoices.choices,
    )

    writer = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        related_name="set_durations",
    )

    survey = models.ForeignKey(
        "surveys.Survey",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="set_durations",
    )

    start_date= models.DateField(
        null=True,
        blank=True,
    )

    end_date= models.DateField(
        null=True,
        blank=True,
    )

    in_a_day_date=models.DateField(
        null=True,
        blank=True,
    )

    def __str__(self):
        return f"{self.user}이 생성한 {self.kind.title()}"