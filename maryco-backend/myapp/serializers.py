from rest_framework import serializers
from .models import Teacher, Course, Category, Student, CourseGroup


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = ['id', 'full_name', 'subject', 'bio', 'photo', 'experience', 'created_at']


class CourseGroupSerializer(serializers.ModelSerializer):
    teachers = TeacherSerializer(many=True, read_only=True)

    class Meta:
        model = CourseGroup
        fields = ['id', 'name', 'teachers', 'schedule']

class CourseSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    teachers = TeacherSerializer(many=True, read_only=True)
    groups = CourseGroupSerializer(many=True, read_only=True)
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
            'program_steps', 'benefits', 'created_at'
        ]


class StudentSerializer(serializers.ModelSerializer):
    courses = CourseSerializer(many=True, read_only=True)

    class Meta:
        model = Student
        fields = ['id', 'full_name', 'courses', 'created_at']