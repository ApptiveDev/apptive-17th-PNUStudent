from django.db import models
from common.models import CommonModel


class Benefit(CommonModel):
    class BenefitKindChoices(models.TextChoices):
        FACILIITY_BENE = ("facility_bene", "시설 관련")
        FOOD_BENE = ("food_bene", "음식점 관련")
        SHOPPING_BENE = ("shopping_bene", "쇼핑 관련")

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
        related_name="benefits",
    )
    category = models.ForeignKey(
        "categories.Category",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="benefits",
    )

    kind = models.CharField(
        max_length=20,
        choices=BenefitKindChoices.choices,
        null=True,
        blank=True,
    )

    def __str__(self) -> str:
        return self.title
