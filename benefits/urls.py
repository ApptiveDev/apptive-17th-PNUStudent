from django.urls import path
from . import views


urlpatterns = [
    path("", views.Benefits.as_view()),
    path("<int:pk>", views.BenefitDetail.as_view()),
    path("<int:pk>/photos", views.BenefitPhotos.as_view()),
]
