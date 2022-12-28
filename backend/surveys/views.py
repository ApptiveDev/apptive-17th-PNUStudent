from django.conf import settings
from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import (
    NotAuthenticated,
    NotFound,
    ParseError,
    PermissionDenied,
)

from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.status import HTTP_204_NO_CONTENT
from rest_framework.views import APIView

from categories.models import Category
from .models import Survey, SurveyParticipate
from .serializers import SurveyParticipateSerializer, SurveyMainListSerializer

class SurveysMain(APIView):
    pass
class SurveysList(APIView):
    pass
class SurveyDetail(APIView):
    pass
class SurveyParticipateDetail(APIView):
    pass

