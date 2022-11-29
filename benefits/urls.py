from django.urls import path
from . import views


urlpatterns = [
    path("main/", views.BenefitsMain.as_view()),
    path("", views.BenefitsList.as_view()),
    path("<int:pk>", views.BenefitDetail.as_view()),
    path("<int:pk>/photos", views.BenefitPhotos.as_view()),
]
