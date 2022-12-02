from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings


urlpatterns = [
    path("admin/", admin.site.urls),
    path("announces/", include("announces.urls")),
    path("categories/", include("categories.urls")),
    path("inquiries/", include("inquiries.urls")),
    path("medias/", include("medias.urls")),
    path("users/", include("users.urls")),
    path("petitions/", include("petitions.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
