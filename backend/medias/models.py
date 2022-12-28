from django.db import models
from common.models import CommonModel


class Photo(CommonModel):

    file = models.URLField(max_length=2000,)
    description = models.CharField(
        max_length=140,
    )
    announce = models.ForeignKey(
        "announces.Announce",
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="photos",
    )
    benefit = models.ForeignKey(
        "benefits.Benefit",
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="photos",
    )
    

    def __str__(self):
        return "Photo File"
