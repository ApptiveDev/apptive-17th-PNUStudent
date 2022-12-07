from django.db import models
from common.models import CommonModel


class Inquiry(CommonModel):

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
        related_name="inquiries",
    )
    category = models.ForeignKey(
        "categories.Category",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="inquiries",
    )

    is_important = models.BooleanField(
        default=False,
    )

    is_answered = models.BooleanField(
        default=False,
    )
    inquiry_content = models.CharField(
        max_length=3000,
        default="",
    )

    def __str__(self) -> str:
        return self.title



class InquiryAnswer(CommonModel):

    

    inquiry_connected = models.ForeignKey(
        "inquiries.Inquiry",
        on_delete=models.CASCADE,
        related_name="inquiry_connected",
    )
    

    def __str__(self) -> str:
        return self.title