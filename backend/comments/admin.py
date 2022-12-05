from django.contrib import admin
from .models import Comment


class QuestionFilter(admin.SimpleListFilter):

    title = "질문사항이 있는지 판단하기"
# 댓글에 ? 가 달리게 되면 학생회 측에서 어드민 패널을 통해서 필터링가능
    parameter_name = "word"

    def lookups(self, request, model_admin):
        return [
            ("?", "?"),
        ]

    def queryset(self, request, comments):
        word = self.value()
        if word:
            return comments.filter(payload__contains=word)
        else:
            comments


@admin.register(Comment)
class ReviewAdmin(admin.ModelAdmin):

    list_display = (
        "__str__",
        "payload",
    )
    list_filter = (
        QuestionFilter,
    )