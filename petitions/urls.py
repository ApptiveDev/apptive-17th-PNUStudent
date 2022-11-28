from django.urls import path
from . import views


urlpatterns = [
    path("main/", views.PetitionMain.as_view()),
    path("", views.PetitionList.as_view()),
    path("<int:pk>", views.PetitionDetail.as_view()),
    path("<int:pk>/photos", views.PetitionPhotos.as_view()),
]
