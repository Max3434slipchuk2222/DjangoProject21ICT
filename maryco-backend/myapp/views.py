from django.db.models import Avg, Q
from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema
from .models import Teacher, Course, Category, Student, News, Promotion, CourseReview, TrialLessonRequest, \
    NewsletterSubscriber
from .serializers import TeacherSerializer, CourseSerializer, CategorySerializer, StudentSerializer, NewsSerializer, \
    PromotionSerializer, CourseReviewSerializer, TrialLessonSerializer, NewsletterSerializer


@extend_schema(tags=['Категорії'])
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'


@extend_schema(tags=['Викладачі'])
class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer


@extend_schema(tags=['Курси'])
class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.annotate(
        average_rating=Avg('reviews__rating', filter=Q(reviews__is_published=True))
    )
    serializer_class = CourseSerializer
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category', 'teachers']
    @action(detail=False, url_path='category/(?P<category_id>[^/.]+)')
    def by_category(self, request, category_id=None):
        courses = self.get_queryset().filter(category_id=category_id)
        serializer = self.get_serializer(courses, many=True)
        return Response(serializer.data)


@extend_schema(tags=['Студенти'])
class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.prefetch_related('courses').all()
    serializer_class = StudentSerializer
@extend_schema(tags=['Новини'])
class NewsViewSet(viewsets.ModelViewSet):
    queryset = News.objects.filter(is_published=True)
    serializer_class = NewsSerializer

@extend_schema(tags=['Акції'])
class PromotionViewSet(viewsets.ModelViewSet):
    queryset = Promotion.objects.filter(is_active=True)
    serializer_class = PromotionSerializer
@extend_schema(tags=['Розсилка'])
class NewsletterViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = NewsletterSubscriber.objects.all()
    serializer_class = NewsletterSerializer

@extend_schema(tags=['Заявки на урок'])
class TrialLessonViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = TrialLessonRequest.objects.all()
    serializer_class = TrialLessonSerializer


@extend_schema(tags=['Відгуки на курси'])
class CourseReviewViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet
):
    serializer_class = CourseReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return CourseReview.objects.filter(is_published=True).select_related('user', 'course')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        return context