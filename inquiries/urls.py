from django.urls import path
from . import views


urlpatterns = [
    path("main/", views.InquiriesList.as_view()),
    path("<int:pk>", views.InquiryDetail.as_view()),
    path("<int:pk>/answer", views.InquiryAnswerDetail.as_view()),
]
