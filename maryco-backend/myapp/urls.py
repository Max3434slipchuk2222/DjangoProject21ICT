from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, TeacherViewSet, CourseViewSet, StudentViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'teachers', TeacherViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'students', StudentViewSet)

urlpatterns = router.urls