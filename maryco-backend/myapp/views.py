from django.db.models import Avg, Q
from rest_framework import viewsets, mixins, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny, SAFE_METHODS
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema
from .models import Teacher, Course, Category, Student, News, Promotion, CourseReview, TrialLessonRequest, \
    NewsletterSubscriber
from .serializers import (
    TeacherSerializer, CourseSerializer, CategorySerializer, StudentSerializer,
    NewsSerializer, PromotionSerializer, CourseReviewSerializer,
    TrialLessonSerializer, NewsletterSerializer, TeacherDashboardSerializer
)
from .permissions import IsAdminUser


# ─── Міксін: читати всі, писати — тільки адмін ───────────────────────────────
class AdminOrReadOnlyMixin:
    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            return [AllowAny()]
        return [IsAdminUser()]


@extend_schema(tags=['Категорії'])
class CategoryViewSet(AdminOrReadOnlyMixin, viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'


@extend_schema(tags=['Викладачі'])
class TeacherViewSet(AdminOrReadOnlyMixin, viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def dashboard(self, request):
        try:
            teacher = Teacher.objects.get(user=request.user)
            serializer = TeacherDashboardSerializer(teacher)
            return Response(serializer.data)
        except Teacher.DoesNotExist:
            return Response({"detail": "Профіль вчителя не знайдено."}, status=404)


@extend_schema(tags=['Курси'])
class CourseViewSet(AdminOrReadOnlyMixin, viewsets.ModelViewSet):
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

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            return [IsAuthenticated()]
        return [IsAdminUser()]


@extend_schema(tags=['Новини'])
class NewsViewSet(viewsets.ModelViewSet):
    serializer_class = NewsSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and getattr(user, 'role', None) == 'admin':
            return News.objects.all()
        return News.objects.filter(is_published=True)

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            return [AllowAny()]
        return [IsAdminUser()]


@extend_schema(tags=['Акції'])
class PromotionViewSet(viewsets.ModelViewSet):
    serializer_class = PromotionSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and getattr(user, 'role', None) == 'admin':
            return Promotion.objects.all()
        return Promotion.objects.filter(is_active=True)

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            return [AllowAny()]
        return [IsAdminUser()]


@extend_schema(tags=['Розсилка'])
class NewsletterViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = NewsletterSubscriber.objects.all()
    serializer_class = NewsletterSerializer


@extend_schema(tags=['Заявки на урок'])
class TrialLessonViewSet(viewsets.ModelViewSet):
    serializer_class = TrialLessonSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and getattr(user, 'role', None) == 'admin':
            return TrialLessonRequest.objects.all().order_by('-created_at')
        return TrialLessonRequest.objects.none()

    def get_permissions(self):
        if self.request.method == 'POST':
            return [AllowAny()]
        return [IsAdminUser()]

    @action(detail=True, methods=['patch'], url_path='set-status')
    def set_status(self, request, pk=None):
        """PATCH /api/trial-lessons/{id}/set-status/ — змінити статус заявки."""
        trial = self.get_object()
        new_status = request.data.get('status')
        if new_status not in ('new', 'processed'):
            return Response({'detail': 'Невірний статус.'}, status=status.HTTP_400_BAD_REQUEST)
        trial.status = new_status
        trial.save(update_fields=['status'])
        return Response(TrialLessonSerializer(trial).data)


@extend_schema(tags=['Відгуки на курси'])
class CourseReviewViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet
):
    serializer_class = CourseReviewSerializer

    def get_permissions(self):
        if self.request.method in ('GET', 'HEAD', 'OPTIONS'):
            return [AllowAny()]
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [IsAdminUser()]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and getattr(user, 'role', None) == 'admin':
            qs = CourseReview.objects.all().select_related('user', 'course')
        else:
            qs = CourseReview.objects.filter(is_published=True).select_related('user', 'course')

        review_type = self.request.query_params.get('review_type')
        if review_type in ('course', 'school'):
            qs = qs.filter(review_type=review_type)

        teacher_user_id = self.request.query_params.get('teacher_user')
        if teacher_user_id:
            qs = qs.filter(
                review_type='course',
                course__teachers__user_id=teacher_user_id
            ).distinct()

        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['patch'], url_path='toggle-publish', permission_classes=[IsAdminUser])
    def toggle_publish(self, request, pk=None):
        """PATCH /api/reviews/{id}/toggle-publish/ — перемикнути публікацію відгуку."""
        review = self.get_object()
        review.is_published = not review.is_published
        review.save(update_fields=['is_published'])
        return Response(CourseReviewSerializer(review, context={'request': request}).data)