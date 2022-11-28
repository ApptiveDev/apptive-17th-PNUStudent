from django.contrib import admin
from .models import Announce


@admin.action(description="모든 게시글 중요 해제")
# 3개의 변수를 받는다 (이 액션을 가지는 모델 관리자, 액션 요청하는 user 정보, 직접 선택한 요소)
def unimportant_all_announces(model_admin, request, announces):
    for announce in announces.all():
        announce.is_important = False
        announce.save()


@admin.register(Announce)
class AnnounceAdmin(admin.ModelAdmin):

    # Always import actions in the ADMIN
    actions = (unimportant_all_announces,)

    list_display = (
        "title",
        "content",
        "category",
        "is_important",
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
        "is_important",
        "writer",
        "kind",
        "created_at",
        "updated_at",
    )
