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
from .models import Benefit
from .serializers import BenefitListSerializer, BenefitDetailSerializer
from medias.serializers import PhotoSerializer


class BenefitsMain(APIView):

    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        all_benefits = Benefit.objects.all()
        total_len = len(all_benefits)
        pick_benefit = []
        for n in range(min(total_len, settings.EACH_BENEFITSMAIN)):
            pick_benefit.append(all_benefits[total_len - 1 - n])

        serializer = BenefitListSerializer(
            pick_benefit,
            many=True,
            context={"request": request},
        )
        return Response(serializer.data)


class BenefitsList(APIView):

    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        try:
            page = request.query_params.get("page", 1)
            page = int(page)
        except ValueError:
            page = 1
        page_size = settings.BENEFITSLIST_PAGE_SIZE
        start = (page - 1) * page_size
        end = start + page_size
        all_benefits = Benefit.objects.all()
        serializer = BenefitListSerializer(
            all_benefits[start:end],
            many=True,
            context={"request": request},
        )
        return Response(serializer.data)

    def post(self, request):
        serializer = BenefitDetailSerializer(data=request.data)
        if serializer.is_valid():
            category_pk = request.data.get("category")
            if not category_pk:
                raise ParseError("카테고리를 제휴혜택으로 설정해주세요")
            try:
                category = Category.objects.get(pk=category_pk)
                if category.kind != Category.CategoryKindChoices.BENEFITS:
                    raise ParseError("카테고리는 '제휴혜택' 이어야합니다.")
            except Category.DoesNotExist:
                raise ParseError("Category not found")
            try:
                with transaction.atomic():
                    benefit = serializer.save(
                        writer=request.user,
                        category=category,
                    )
                    serializer = BenefitDetailSerializer(
                        benefit,
                        context={"request": request},
                    )
                    return Response(serializer.data)
            except Exception as e:
                raise ParseError("Benifit not found")
        else:
            return Response(
                serializer.errors,
                status=HTTP_400_BAD_REQUEST,
            )


class BenefitDetail(APIView):

    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_object(self, pk):
        try:
            return Benefit.objects.get(pk=pk)
        except Benefit.DoesNotExist:
            raise NotFound

    def get(self, request, pk):
        benefit = self.get_object(pk)
        serializer = BenefitDetailSerializer(
            benefit,
            context={"request": request},
        )
<<<<<<< Updated upstream
=======
        benefit.hits+=1
        benefit.save()
>>>>>>> Stashed changes
        return Response(serializer.data)

    def put(self, request, pk):
        benefit = self.get_object(pk)
        if benefit.writer != request.user:
            raise PermissionDenied

        serializer = BenefitDetailSerializer(
            benefit,
            data=request.data,
            partial=True,
        )

        if serializer.is_valid():
            benefit = serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors)

    def delete(self, request, pk):
        benefit = self.get_object(pk)
        if benefit.writer != request.user:
            raise PermissionDenied
        benefit.delete()
        return Response(status=HTTP_204_NO_CONTENT)


class BenefitPhotos(APIView):

    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_object(self, pk):
        try:
            return Benefit.objects.get(pk=pk)
        except Benefit.DoesNotExist:
            raise NotFound

    def post(self, request, pk):
        benefit = self.get_object(pk)
        if request.user != benefit.writer:
            raise PermissionDenied

        serializer = PhotoSerializer(data=request.data)
        if serializer.is_valid():
            photo = serializer.save(benefit=benefit)
            serializer = PhotoSerializer(photo)
            return Response(serializer.data)

        else:
            return Response(serializer.errors)
