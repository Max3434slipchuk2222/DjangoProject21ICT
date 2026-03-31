from django.db import models
from django_resized import ResizedImageField


class Teacher(models.Model):
    full_name = models.CharField(max_length=100)
    subject = models.CharField(max_length=100)
    bio = models.TextField(blank=True, null=True, verbose_name="Біографія викладача")
    photo = ResizedImageField(size=[400, 400], quality=90, upload_to='teachers_images/', null=True, crop=None, blank=True)
    experience = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "tblTeachers"
        ordering = ['full_name']

    def __str__(self):
        return self.full_name


class Category(models.Model):
    name = models.CharField(max_length=100, verbose_name="Назва категорії")

    class Meta:
        db_table = "tblCategories"
        ordering = ['name']

    def __str__(self):
        return self.name


class Course(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True, default='')
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='courses', null=True, blank=True)
    image = ResizedImageField(
        size=[1920, 1080],
        quality=95,
        force_format='WEBP',
        upload_to='courses_images/',
        null=True,
        blank=True,
        crop=None
    )
    age_range = models.CharField(max_length=50, null=True)
    duration_info = models.CharField(max_length=50, null=True)
    format_info = models.CharField(max_length=50, null=True)
    program_steps = models.JSONField(default=list, blank=True, null=True)
    benefits = models.JSONField(default=list, blank=True, null=True)
    teachers = models.ManyToManyField(Teacher, related_name='courses', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "tblCourses"
        ordering = ['title']
    def __str__(self):
        return self.title

class Student(models.Model):
    full_name = models.CharField(max_length=100)
    courses = models.ManyToManyField(Course)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "tblStudents"
        ordering = ['full_name']

    def __str__(self):
        return self.full_name

class CourseGroup(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='groups')
    name = models.CharField(max_length=100)
    teachers = models.ManyToManyField(Teacher, related_name='groups', blank=True)
    schedule = models.CharField(max_length=200)

    class Meta:
        db_table = "tblCourseGroups"
        verbose_name = "Група курсу"
        verbose_name_plural = "Групи курсів"

    def __str__(self):
        return f"{self.course.title} - {self.name}"