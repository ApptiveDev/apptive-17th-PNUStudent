from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from . import views

urlpatterns = [
    path("", views.Users.as_view()),
    path("mypage", views.MyPage.as_view()),
    path("changepassword", views.ChangePassword.as_view()),
    path("logout", views.LogOut.as_view()),
    path("jwt-login", views.JWTLogIn.as_view()),
    path("@<str:username>", views.PublicUser.as_view()),
]
