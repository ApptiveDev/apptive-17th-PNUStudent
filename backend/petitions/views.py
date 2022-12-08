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
    AgreeThisPetitionSerializer,
)
from medias.serializers import PhotoSerializer
from comments.serializers import CommentSerializer


class PetitionMain(APIView):

    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        all_petitons = Petition.objects.all()
        total_len = len(all_petitons)
        pick_petitions = []
        for n in range(min(total_len, settings.EACH_PETITIONSMAIN)):
            pick_petitions.append(all_petitons[total_len - 1 - n])

        serializer = PetitionMainListSerializer(
            pick_petitions,
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
                if category.kind != Category.CategoryKindChoices.PETITIONS:
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
                if category.kind != Category.CategoryKindChoices.PETITIONS:
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
<<<<<<< Updated upstream
=======
        petition.hits+=1
        petition.save()
        print(serializer)
>>>>>>> Stashed changes
        return Response(serializer.data)

    def put(self, request, pk):
        petition = self.get_object(pk)
        if petition.writer != request.user:
            raise PermissionDenied

        serializer = PetitionDetailSerializer(
            petition,
            data=request.data,
            partial=True,
            context={"request": request},
        )

        if serializer.is_valid():
            petition = serializer.save()
            return Response(serializer.data)
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


class PetitionAgree(APIView):
    def get_object(self, pk):
        try:
            return Petition.objects.get(pk=pk)
        except Petition.DoesNotExist:
            raise NotFound

    def get(self, request, pk):
        petition = self.get_object(pk)
        serializer = AgreeThisPetitionSerializer(
            petition,
            context={"request": request},
        )
        return Response(serializer.data)

    def put(self, request, pk):
        petition = self.get_object(pk)
        serializer = AgreeThisPetitionSerializer(
            petition,
            data=request.data,
            partial=True,
        )
        if petition.writer == request.user:
            raise PermissionDenied("자신의 글에 동의를 할 수 없습니다")
        else:
            if serializer.is_valid():
                if petition.agree.filter(pk=request.user.pk).exists():
                    petition.agree.remove(request.user.pk)
                    return Response(serializer.data)
                else:
                    petition.agree.add(request.user.pk)
                    return Response(serializer.data)
            else:
                return Response(serializer.errors)


class PetitionComment(APIView):
    
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_object(self, pk):
        try:
            return Petition.objects.get(pk=pk)
        except Petition.DoesNotExist:
            raise NotFound

    def get(self, request, pk):
        petition = self.get_object(pk)
        serializer = CommentSerializer(
            petition.comments.all(),
            many=True,
        )
        return Response(serializer.data)

    def post(self, request, pk):
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    comments = serializer.save(
                        user=request.user,
                        petition = self.get_object(pk),
                    )
                return Response(serializer.data)
            except Exception:
                raise ParseError("comment not found")
        else:
            return Response(serializer.errors)