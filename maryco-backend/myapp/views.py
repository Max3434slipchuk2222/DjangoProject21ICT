from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema
from .models import Teacher, Course, Category, Student
from .serializers import TeacherSerializer, CourseSerializer, CategorySerializer, StudentSerializer


@extend_schema(tags=['Категорії'])
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


@extend_schema(tags=['Викладачі'])
class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer


@extend_schema(tags=['Курси'])
class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.select_related('category').prefetch_related('teachers', 'groups').all()
    serializer_class = CourseSerializer
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