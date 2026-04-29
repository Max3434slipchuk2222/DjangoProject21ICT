from rest_framework import serializers
from .models import Teacher, Course, Category, Student, CourseGroup, News, Promotion, NewsletterSubscriber, \
    TrialLessonRequest, CourseReview


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class TeacherCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'title', 'price']

class TeacherSerializer(serializers.ModelSerializer):
    courses = TeacherCourseSerializer(many=True, read_only=True)

    class Meta:
        model = Teacher
        fields = ['id', 'full_name', 'subject', 'bio', 'photo', 'experience', 'courses', 'created_at']
class CourseGroupSerializer(serializers.ModelSerializer):
    teachers = TeacherSerializer(many=True, read_only=True)

    class Meta:
        model = CourseGroup
        fields = ['id', 'name', 'teachers', 'schedule']
class NewsletterSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = ['id', 'email', 'created_at']

class TrialLessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrialLessonRequest
        fields = ['id', 'full_name', 'phone', 'child_age', 'course', 'status', 'created_at']
        read_only_fields = ['status']

class CourseReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseReview
        fields = ['id', 'course', 'author_name', 'rating', 'comment', 'created_at']
class CourseSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    teachers = TeacherSerializer(many=True, read_only=True)
    groups = CourseGroupSerializer(many=True, read_only=True)
    reviews = serializers.SerializerMethodField()  # Розумне поле
    average_rating = serializers.FloatField(read_only=True)

    def get_reviews(self, obj):
        published_reviews = obj.reviews.filter(is_published=True)
        return CourseReviewSerializer(published_reviews, many=True).data

    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True
    )
    teacher_ids = serializers.PrimaryKeyRelatedField(
        queryset=Teacher.objects.all(), source='teachers', many=True, write_only=True
    )

    class Meta:
        model = Course
        fields = [
            'id', 'title', 'description', 'price', 'image',
            'category', 'category_id',
            'teachers', 'teacher_ids', 'groups',
            'age_range', 'duration_info', 'format_info',
            'program_steps', 'benefits', 'created_at',
            'average_rating', 'reviews'
        ]


class StudentSerializer(serializers.ModelSerializer):
    courses = CourseSerializer(many=True, read_only=True)

    class Meta:
        model = Student
        fields = ['id', 'full_name', 'courses', 'created_at']
class NewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = ['id', 'title', 'content', 'image', 'created_at']


class PromotionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promotion
        fields = ['id', 'title', 'description', 'discount', 'image', 'valid_until', 'is_active', 'created_at']
