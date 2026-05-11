from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, TeacherViewSet, CourseViewSet, StudentViewSet, NewsViewSet, PromotionViewSet, \
    NewsletterViewSet, TrialLessonViewSet, CourseReviewViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'teachers', TeacherViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'students', StudentViewSet)
router.register(r'news', NewsViewSet, basename='news')
router.register(r'promotions', PromotionViewSet, basename='promotion')
router.register(r'newsletter', NewsletterViewSet, basename='newsletter')
router.register(r'trial-lessons', TrialLessonViewSet, basename='trial-lesson')
router.register(r'reviews', CourseReviewViewSet, basename='review')

urlpatterns = router.urls
