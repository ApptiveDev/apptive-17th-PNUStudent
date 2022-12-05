from django.urls import path
from . import views


urlpatterns = [
    path("main/", views.AnnouncesMain.as_view()),
    path("", views.AnnouncesList.as_view()),
    path("<int:pk>", views.AnnounceDetail.as_view()),
    path("<int:pk>/photos", views.AnnouncePhotos.as_view()),
]
