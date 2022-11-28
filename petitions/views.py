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
from rest_framework.views import APIView

from categories.models import Category
from .models import Petition
from .serializers import (
    PetitionMainListSerializer,
    PetitionTextListSerializer,
    PetitionDetailSerializer,
)
from medias.serializers import PhotoSerializer


class PetitionMain(APIView):

    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        all_petitons = Petition.objects.all()[-settings.EACH_PETITIONSMAIN :]
        serializer = PetitionMainListSerializer(
            all_petitons,
            many=True,
            # KeyError get_is_writer(RoomListSerializer)의 request 키를 context로 import
            context={"request": request},
        )
        return Response(serializer.data)

    def post(self, request):
        serializer = PetitionDetailSerializer(data=request.data)
        if serializer.is_valid():
            category_pk = request.data.get("category")
            if not category_pk:
                raise ParseError("카테고리를 청원 게시판으로 설정해주세요")
            try:
                category = Category.objects.get(pk=category_pk)
                if category.kind != Category.CategoryKindChoices.ANNOUNCES:
                    raise ParseError("카테고리는 '청원 게시판' 이어야합니다.")
            except Category.DoesNotExist:
                raise ParseError("Category not found")
            try:
                with transaction.atomic():
                    petition = serializer.save(
                        writer=request.user,
                        category=category,
                        is_important=False,
                    )
                    serializer = PetitionDetailSerializer(
                        petition,
                        context={"request": request},
                    )
                    return Response(serializer.data)
            except Exception as e:
                raise ParseError("Petition not found")
        else:
            return Response(
                serializer.errors,
                status=HTTP_400_BAD_REQUEST,
            )


class PetitionList(APIView):

    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        try:
            page = request.query_params.get("page", 1)
            page = int(page)
        except ValueError:
            page = 1
        page_size = settings.PETITIONLIST_PAGE_SIZE
        start = (page - 1) * page_size
        end = start + page_size
        all_petitons = Petition.objects.all()
        serializer = PetitionTextListSerializer(
            all_petitons[start:end],
            many=True,
            context={"request": request},
        )
        return Response(serializer.data)

    def post(self, request):
        serializer = PetitionDetailSerializer(data=request.data)
        if serializer.is_valid():
            category_pk = request.data.get("category")
            if not category_pk:
                raise ParseError("카테고리를 청원 게시판으로 설정해주세요")
            try:
                category = Category.objects.get(pk=category_pk)
                if category.kind != Category.CategoryKindChoices.ANNOUNCES:
                    raise ParseError("카테고리는 '청원 게시판' 이어야합니다.")
            except Category.DoesNotExist:
                raise ParseError("Category not found")
            try:
                with transaction.atomic():
                    petition = serializer.save(
                        writer=request.user,
                        category=category,
                    )
                    serializer = PetitionDetailSerializer(
                        petition,
                        context={"request": request},
                    )
                    return Response(serializer.data)
            except Exception as e:
                raise ParseError("Petition not found")
        else:
            return Response(
                serializer.errors,
                status=HTTP_400_BAD_REQUEST,
            )


class PetitionDetail(APIView):

    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_object(self, pk):
        try:
            return Petition.objects.get(pk=pk)
        except Petition.DoesNotExist:
            raise NotFound

    def get(self, request, pk):
        petition = self.get_object(pk)
        serializer = PetitionDetailSerializer(
            petition,
            context={"request": request},
        )
        return Response(serializer.data)

    def put(self, request, pk):
        petition = self.get_object(pk)
        if petition.writer != request.user:
            raise PermissionDenied

        serializer = PetitionDetailSerializer(
            petition,
            data=request.data,
            partial=True,
        )

        if serializer.is_valid():
            category_pk = request.data.get("category")
            if category_pk:
                try:
                    category = Category.objects.get(pk=category_pk)
                    if category.kind != Category.CategoryKindChoices.ANNOUNCES:
                        raise ParseError("The category kind should be announces")
                except Category.DoesNotExist:
                    raise ParseError(detail="Petition not found")
        else:
            return Response(serializer.errors)

    def delete(self, request, pk):
        petition = self.get_object(pk)
        if petition.writer != request.user:
            raise PermissionDenied
        petition.delete()
        return Response(status=HTTP_204_NO_CONTENT)


class PetitionPhotos(APIView):

    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_object(self, pk):
        try:
            return Petition.objects.get(pk=pk)
        except Petition.DoesNotExist:
            raise NotFound

    def post(self, request, pk):
        petition = self.get_object(pk)
        if request.user != petition.writer:
            raise PermissionDenied
        serializer = PhotoSerializer(data=request.data)
        if serializer.is_valid():
            photo = serializer.save(petition=petition)
            serializer = PhotoSerializer(photo)
            return Response(serializer.data)
        else:
            return Response(serializer.errors)
