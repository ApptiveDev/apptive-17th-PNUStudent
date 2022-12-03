from django.urls import path
from . import views


urlpatterns = [
    path("main/", views.SurveysMain.as_view()),
    path("", views.SurveysList.as_view()),
    path("<int:pk>", views.SurveyDetail.as_view()),
    path("<int:pk>/", views.SurveyParticipateDetail.as_view()),
]
