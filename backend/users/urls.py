from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from . import views

urlpatterns = [
    # 회원가입
    path("", views.Users.as_view()),
    # 비밀번호 변경
    path("changepassword", views.ChangePassword.as_view()),
    # 로그인
    path("login", views.JWTLogIn.as_view()),
    # 로그아웃
    path("logout", views.LogOut.as_view()),
    # 내 정보보기(민감한 내용 포함, 내 정보 수정 가능)
    path("mypage", views.MyPage.as_view()),
    # 회원 정보 보기(다른 회원이 볼수 있는 내 정보)
    path("@<str:username>", views.PublicUser.as_view()),
]
