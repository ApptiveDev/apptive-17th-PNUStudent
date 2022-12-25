from django.contrib import admin
from .models import Survey,SurveyParticipate


@admin.register(Survey)
class SurveyAdmin(admin.ModelAdmin):

    list_display = (
        "title",
        "content",
        "category",
        "writer",
        "on_processing",
        "is_over",
    )
    search_fields = (
        #
        "writer__username",
    )
    list_filter = (
        "category",
        "writer",
        "on_processing",
        "created_at",
        "updated_at",
        "is_over",
    )

    def __str__(self) -> str:
        return self.title



@admin.register(SurveyParticipate)
class SurveyParticipateAdmin(admin.ModelAdmin):

    list_filter = (
        "survey",
        "created_at",
        "updated_at",
    )