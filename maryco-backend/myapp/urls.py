from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, TeacherViewSet, CourseViewSet, StudentViewSet

router = DefaultRouter()
router.register('categories', CategoryViewSet)
router.register('teachers', TeacherViewSet)
router.register('courses', CourseViewSet)
router.register('students', StudentViewSet)

urlpatterns = router.urls