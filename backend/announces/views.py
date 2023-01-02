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
from .models import Announce
from .serializers import AnnounceListSerializer, AnnounceDetailSerializer,AnnounceSearchSerializer
from medias.serializers import PhotoSerializer

class AnnouncesSearch(APIView):
    
    permission_classes = [IsAuthenticatedOrReadOnly]

    def post(self, request):

        serializer = AnnounceSearchSerializer(data=request.data)
        if serializer.is_valid():
            include_announce=[]
            searchword = request.data.get("search_field")
            if not searchword:
                raise ParseError("검색어를 입력하시오")
            try:
                announces = Announce.objects.all()
                for announce in announces:
                    print(announce)
                    if announce.find(searchword):
                        include_announce.append(announce.get("pk"))
                    serializer = (include_announce,)
                    print(include_announce.data)
                return Response(serializer.data)
            except:
                raise ParseError("검색결과가 없습니다.")



class AnnouncesMain(APIView):

    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        all_announces = Announce.objects.all()
        total_len = len(all_announces)
        pick_announce = []
        for n in range(min(total_len, settings.EACH_ANNOUNCESMAIN)):
            pick_announce.append(all_announces[total_len - 1 - n])

        serializer = AnnounceListSerializer(
            pick_announce,
            many=True,
            context={"request": request,},
        )
        return Response(serializer.data)


class AnnouncesList(APIView):

    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):

        try:
            page = request.query_params.get("page", 1)
            page = int(page)
        except ValueError:
            page = 1
        page_size = settings.ANNOUNCESLIST_PAGE_SIZE
        start = (page - 1) * page_size
        end = start + page_size
        all_announces = Announce.objects.all().order_by('-id')
        serializer = AnnounceListSerializer(
            all_announces[start:end],
            many=True,
            # KeyError get_is_owner(RoomListSerializer)의 request 키를 context로 import
            context={"request": request},
        )
        return Response(serializer.data)

    def post(self, request):
        serializer = AnnounceDetailSerializer(data=request.data)
        if serializer.is_valid():
            category_pk = request.data.get("category")
            if not category_pk:
                raise ParseError("카테고리를 공지사항으로 설정해주세요")
            try:
                category = Category.objects.get(pk=category_pk)
                if category.kind != Category.CategoryKindChoices.ANNOUNCES:
                    raise ParseError("카테고리는 '공지사항' 이어야합니다.")
            except Category.DoesNotExist:
                raise ParseError("Category not found")
            try:
                with transaction.atomic():
                    announce = serializer.save(
                        writer=request.user,
                        category=category,
                    )
                    serializer = AnnounceDetailSerializer(
                        announce,
                        context={"request": request},
                    )
                    return Response(serializer.data)
            except Exception as e:
                raise ParseError("Announce not found")
        else:
            return Response(
                serializer.errors,
                status=HTTP_400_BAD_REQUEST,
            )


class AnnounceDetail(APIView):

    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_object(self, pk):
        try:
            return Announce.objects.get(pk=pk)
        except Announce.DoesNotExist:
            raise NotFound

    def get(self, request, pk):
        announce = self.get_object(pk)
        serializer = AnnounceDetailSerializer(
            announce,
            context={"request": request},
        )
        announce.hits+=1
        announce.save()
        return Response(serializer.data)

    def put(self, request, pk):
        announce = self.get_object(pk)
        if announce.writer != request.user:
            raise PermissionDenied

        serializer = AnnounceDetailSerializer(
            announce,
            data=request.data,
            partial=True,
        )

        if serializer.is_valid():
            announce=serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors)

    def delete(self, request, pk):
        announce = self.get_object(pk)
        if announce.writer != request.user:
            raise PermissionDenied
        announce.delete()
        return Response(status=HTTP_204_NO_CONTENT)


class AnnouncePhotos(APIView):

    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_object(self, pk):
        try:
            return Announce.objects.get(pk=pk)
        except Announce.DoesNotExist:
            raise NotFound

    def post(self, request, pk):
        announce = self.get_object(pk)
        if request.user != announce.writer:
            raise PermissionDenied
        serializer = PhotoSerializer(data=request.data)
        if serializer.is_valid():
            photo = serializer.save(announce=announce)
            serializer = PhotoSerializer(photo)
            return Response(serializer.data)
        else:
            return Response(serializer.errors)
