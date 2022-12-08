from django.db import models
from common.models import CommonModel


class Comment(CommonModel):

    """Review from a User to a Room or Experience"""

    user = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        related_name="comments",
    )

    petition = models.ForeignKey(
        "petitions.Petition",
        null = True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="comments",
    )

    payload = models.TextField(
        max_length=150,
        default="",
    )

    def __str__(self) -> str:
        return f"{self.user} / {self.payload}"
