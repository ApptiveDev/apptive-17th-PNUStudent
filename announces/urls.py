from django.urls import path
from . import views


urlpatterns = [
    path("", views.Announces.as_view()),
    path("<int:pk>", views.AnnounceDetail.as_view()),
    path("<int:pk>/photos", views.AnnouncePhotos.as_view()),
]
