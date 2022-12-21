from django.contrib import admin
from .models import SetDurations

@admin.register(SetDurations)
class SetDurations(admin.ModelAdmin):
    list_display = (
        "kind",
        "writer",
        "survey",
        "start_date",
        "end_date",
        "in_a_day_date",
    )
    list_filter = ("kind",)