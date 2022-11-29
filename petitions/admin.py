from django.contrib import admin
from .models import Petition, Agree


@admin.action(description="모든 게시글 청원 수락")
# 3개의 변수를 받는다 (이 액션을 가지는 모델 관리자, 액션 요청하는 user 정보, 직접 선택한 요소)
def accept_all_petitions(model_admin, request, petitions):
    for petition in petitions.all():
        petition.on_processing = True
        petition.save()


@admin.register(Petition)
class AnnounceAdmin(admin.ModelAdmin):

    # Always import actions in the ADMIN
    actions = (accept_all_petitions,)

    list_display = (
        "title",
        "content",
        "category",
        "is_important",
        "on_processing",
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
        "on_processing",
        "created_at",
        "updated_at",
    )



@admin.register(Agree)
class AgreeAdmin(admin.ModelAdmin):

    list_filter = ("created_at", )