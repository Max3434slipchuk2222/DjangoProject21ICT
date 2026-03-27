from django.db import models
from django_resized import ResizedImageField


class Teacher(models.Model):
    full_name = models.CharField(max_length=100)
    subject = models.CharField(max_length=100)
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
        size=[800, 600],
        quality=85,
        force_format='WEBP',
        upload_to='courses_images/',
        null=True,
        blank=True
    )
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, null=True, blank=True)
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
