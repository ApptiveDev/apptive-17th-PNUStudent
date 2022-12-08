from django.db import models
from common.models import CommonModel


class Category(CommonModel):

    """Room or Experience Category"""

    class CategoryKindChoices(models.TextChoices):
        ANNOUNCES = "announces", "공지사항"
        BENEFITS = "benefits", "제휴혜택"
        INQUIRIES = "inquiries", "문의/건의"
        PETITIONS = "petitions", "청원 게시판"
        SURVEYS = "serveys", "설문조사"

    name = models.CharField(
        max_length=50,
    )
    kind = models.CharField(
        max_length=15,
        choices=CategoryKindChoices.choices,
        null=True,
        blank=True,
    )

    def __str__(self) -> str:
        return f"{self.name}"

    class Meta:
        verbose_name_plural = "Categories"
