from django.contrib import admin
from .models import Inquiry, InquiryAnswer


@admin.register(Inquiry)
class AnnounceAdmin(admin.ModelAdmin):


    list_display = (
        "title",
        "content",
        "category",
        "is_important",
        "is_answered",
        "writer",
        "created_at",
    )
    search_fields = (
        #
        "writer__username",
    )
    list_filter = (
        "category",
        "is_important",
        "writer",
        "is_answered",
        "created_at",
        "updated_at",
    )
