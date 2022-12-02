from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    class MajorChoices(models.TextChoices):
        # NAME = (value, label)
        ASE = ("aerospaceE", "항공우주공학과")
        CSE = ("computerscienceE", "컴퓨터공학과")

    first_name = models.CharField(
        max_length=150,
        editable=False,
    )
    last_name = models.CharField(
        max_length=150,
        editable=False,
    )
    name = models.CharField(
        max_length=150,
        default="",
    )
    is_cert = models.BooleanField(default=False)
    is_superuser=models.BooleanField(default=False)
    is_council = models.BooleanField(default=False)
    major = models.CharField(
        max_length=20,
        choices=MajorChoices.choices,
    )
