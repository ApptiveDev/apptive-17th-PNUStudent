from django.db import models
from common.models import CommonModel


class Petition(CommonModel):

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
        related_name="petitions",
    )
    agree = models.ManyToManyField(
        "petitions.PetitionAgree",
        blank=True,
        related_name="petition_agree",
    )
    category = models.ForeignKey(
        "categories.Category",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="petitions",
    )
    
    is_important = models.BooleanField(
        default=False,
    )

    on_processing = models.BooleanField(
        default=False,
    )

    def __str__(self) -> str:
        return self.title

    def count_agree(petition):
        return petition.agree.count()

    def count_comment(petition):
        return petition.comments.count()


class PetitionAgree(CommonModel):
    """Like Model Definition"""

    user = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        related_name="agrees",
    )
    petition = models.ForeignKey(
        "petitions.Petition",
        on_delete=models.CASCADE,
        related_name="agrees",
    )

    def __str__(self):
        return f"{self.petition.title}"

