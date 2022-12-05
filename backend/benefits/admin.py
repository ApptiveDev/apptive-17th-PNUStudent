from django.contrib import admin
from .models import Benefit


@admin.action(description="Set all prices to zero")
# 3개의 변수를 받는다 (이 액션을 가지는 모델 관리자, 액션 요청하는 user 정보, 직접 선택한 요소)
def delete_all_benefits(model_admin, request, benefits):
    for benefit in benefits.all():
        benefit.delete()


@admin.register(Benefit)
class AnnounceAdmin(admin.ModelAdmin):

    # Always import actions in the ADMIN
    actions = (delete_all_benefits,)

    list_display = (
        "title",
        "content",
        "category",
        "writer",
        "kind",
        "created_at",
    )
    search_fields = (
        #
        "writer__username",
    )
    list_filter = (
        "category",
        "writer",
        "kind",
        "created_at",
        "updated_at",
    )
