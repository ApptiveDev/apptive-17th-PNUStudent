from django.conf import settings
from django.db import transaction
from django.utils import timezone
from rest_framework.status import HTTP_204_NO_CONTENT, HTTP_400_BAD_REQUEST
from rest_framework.exceptions import (
    NotAuthenticated,
    NotFound,
    ParseError,
    PermissionDenied,
)
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response

from categories.models import Category
from .models import Inquiry
from .serializers import (
    InquiryListSerializer,
    InquiryDetailSerializer,
    InquiryAnswerDetailSerializer,
)
from medias.serializers import PhotoSerializer
from users.models import User


class InquiriesList(APIView):

    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        try:
            page = request.query_params.get("page", 1)
            page = int(page)
        except ValueError:
            page = 1
        page_size = settings.INQUIRYLIST_PAGE_SIZE
        start = (page - 1) * page_size
        end = start + page_size
        all_inquires = Inquiry.objects.all()
        serializer = InquiryListSerializer(
            all_inquires[start:end],
            many=True,
            context={"request": request},
        )
        return Response(serializer.data)

    def post(self, request):
        serializer = InquiryDetailSerializer(data=request.data)
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    inquiry = serializer.save(
                        writer=request.user,
                    )
                    serializer = InquiryDetailSerializer(
                        inquiry,
                        context={"request": request},
                    )
                    return Response(serializer.data)
            except Exception as e:
                raise ParseError("Inquiry not found")
        else:
            return Response(
                serializer.errors,
                status=HTTP_400_BAD_REQUEST,
            )


class InquiryDetail(APIView):

    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_object(self, pk):
        try:
            return Inquiry.objects.get(pk=pk)
        except Inquiry.DoesNotExist:
            raise NotFound

    def get(self, request, pk):
        inquiry = self.get_object(pk)
        serializer = InquiryDetailSerializer(
            inquiry,
            context={"request": request},
        )
        inquiry.hits+=1
        inquiry.save()
        return Response(serializer.data)

    def put(self, request, pk):
        inquiry = self.get_object(pk)
        if inquiry.writer != request.user:
            raise PermissionDenied

        serializer = InquiryDetailSerializer(
            inquiry,
            data=request.data,
            partial=True,
            context={"request": request},
        )

        if serializer.is_valid():
            inquiry = serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors)

    def delete(self, request, pk):
        inquiry = self.get_object(pk)
        if inquiry.writer != request.user:
            raise PermissionDenied
        inquiry.delete()
        return Response(status=HTTP_204_NO_CONTENT)


class InquiryAnswerDetail(APIView):
    
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_object(self, pk):
        try:
            return Inquiry.objects.get(pk=pk)
        except Inquiry.DoesNotExist:
            raise NotFound

    def get(self, request, pk):
        inquiry = self.get_object(pk)
        serializer = InquiryAnswerDetailSerializer(
            inquiry,
            context={"request": request},
        )
        return Response(serializer.data)

    def put(self, request, pk):
        inquiry = self.get_object(pk)
        if request.user.is_superuser!=True:
            raise PermissionDenied

        serializer = InquiryAnswerDetailSerializer(
            inquiry,
            data=request.data,
            partial=True,
            context={"request": request},
        )

        if serializer.is_valid():
            inquiry = serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors)

    def delete(self, request, pk):
        inquiry = self.get_object(pk)
        if inquiry.writer != request.user:
            raise PermissionDenied
        inquiry.delete()
        return Response(status=HTTP_204_NO_CONTENT)