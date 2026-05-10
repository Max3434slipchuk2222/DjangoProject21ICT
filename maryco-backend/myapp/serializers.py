from rest_framework import serializers
from .models import Teacher, Course, Category, Student, CourseGroup, News, Promotion, NewsletterSubscriber, \
    TrialLessonRequest, CourseReview
from users.serializers import UserSerializer


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']


class TeacherCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'title', 'price']


class TeacherSerializer(serializers.ModelSerializer):
    courses = TeacherCourseSerializer(many=True, read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Teacher
        fields = ['id', 'user', 'full_name', 'subject', 'bio', 'photo', 'experience', 'courses', 'created_at']

class StudentShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['id', 'full_name']
class CourseGroupSerializer(serializers.ModelSerializer):
    teachers = TeacherSerializer(many=True, read_only=True)
    students = StudentShortSerializer(many=True, read_only=True)
    students_count = serializers.IntegerField(source='students.count', read_only=True)
    course_title = serializers.CharField(source='course.title', read_only=True)

    class Meta:
        model = CourseGroup
        fields = ['id', 'name', 'course_title', 'teachers', 'schedule', 'students', 'students_count']


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
    user = UserSerializer(read_only=True)

    class Meta:
        model = CourseReview
        fields = ['id', 'review_type', 'course', 'user', 'rating', 'comment', 'created_at']
        read_only_fields = ['user', 'created_at']

    def validate(self, data):
        request = self.context.get('request')
        review_type = data.get('review_type', 'course')
        course = data.get('course')

        if review_type == 'course' and not course:
            raise serializers.ValidationError(
                {"course": "Для відгуку на курс необхідно вказати курс."}
            )

        if review_type == 'school':
            data['course'] = None

        if review_type == 'course' and request and course:
            if CourseReview.objects.filter(course=course, user=request.user, review_type='course').exists():
                raise serializers.ValidationError(
                    {"detail": "Ви вже залишали відгук на цей курс."}
                )

        return data


class CourseSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    teachers = TeacherSerializer(many=True, read_only=True)
    groups = CourseGroupSerializer(many=True, read_only=True)
    reviews = serializers.SerializerMethodField()
    average_rating = serializers.FloatField(read_only=True)

    def get_reviews(self, obj):
        published_reviews = obj.reviews.filter(is_published=True)
        return CourseReviewSerializer(published_reviews, many=True, context=self.context).data

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
            'id', 'title', 'slug', 'description', 'price', 'image',
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


class TeacherDashboardSerializer(serializers.ModelSerializer):
    groups = CourseGroupSerializer(many=True, read_only=True)

    class Meta:
        model = Teacher
        fields = ['id', 'full_name', 'subject', 'photo', 'bio', 'experience', 'groups']