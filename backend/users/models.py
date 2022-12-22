from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    class MajorChoices(models.TextChoices):
        # NAME = (value, label)
        # value 값을 회원가입시에 (urls = ~users/) major 에 넣어주어야함. str값
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

    # 첫 회원가입시에 모든 유저들은 권한을 가지지 않고 db에 저장된다.
    is_cert = models.BooleanField(default=False)
    is_superuser=models.BooleanField(default=False)
    is_council = models.BooleanField(default=False)
    major = models.CharField(
        max_length=20,
        choices=MajorChoices.choices,
    )
