from django.urls import path
from . import views
from .views import AnnouncesSearch


urlpatterns = [
    path("main/", views.AnnouncesMain.as_view()),
    path("search/", views.AnnouncesSearch.as_view(), name='search'),
    path("", views.AnnouncesList.as_view()),
    path("<int:pk>", views.AnnounceDetail.as_view()),
    path("<int:pk>/photos", views.AnnouncePhotos.as_view()),
]
