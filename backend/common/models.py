from django.db import models


class CommonModel(models.Model):

    """Common Model Definition"""

<<<<<<< Updated upstream
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
=======
    created_at = models.DateTimeField(auto_now_add=True,)
    updated_at = models.DateTimeField(auto_now=True,)

    hits = models.PositiveIntegerField(default=0,)
>>>>>>> Stashed changes

    class Meta:
        abstract = True
