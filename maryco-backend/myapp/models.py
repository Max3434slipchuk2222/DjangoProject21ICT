from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django_resized import ResizedImageField
from slugify import slugify as slugify_cyrillic

from DjangoProject21ICT import settings

def generate_unique_slug(model, names_text, instance=None):
    base_slug = slugify_cyrillic(names_text) or 'item'
    slug = base_slug
    items = model.objects.all()
    if instance and instance.pk:
        items = items.exclude(pk=instance.pk)
    counter = 2
    while items.filter(slug=slug).exists():
        slug = f'{base_slug}-{counter}'
        counter += 1
    return slug


class Teacher(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='teacher_profile'
    )
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

    slug = models.SlugField(max_length=100, unique=True, blank=True,)
    class Meta:
        db_table = "tblCategories"
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(Category, self.name, self)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Course(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True, default='')
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
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

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(Course, self.title, self)
        super().save(*args, **kwargs)

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
    students = models.ManyToManyField(Student, related_name='groups', blank=True, verbose_name="Студенти в групі")
    class Meta:
        db_table = "tblCourseGroups"
        verbose_name = "Група курсу"
        verbose_name_plural = "Групи курсів"

    def __str__(self):
        return f"{self.course.title} - {self.name}"
class News(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    image = ResizedImageField(
        size=[800, 500],
        quality=85,
        force_format='WEBP',
        upload_to='news_images/',
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    is_published = models.BooleanField(default=True)

    class Meta:
        db_table = "tblNews"
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Promotion(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    discount = models.CharField(max_length=50)
    image = ResizedImageField(
        size=[800, 500],
        quality=85,
        force_format='WEBP',
        upload_to='promotions_images/',
        null=True,
        blank=True
    )
    valid_until = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "tblPromotions"
        ordering = ['-created_at']

    def __str__(self):
        return self.title
class NewsletterSubscriber(models.Model):
    email = models.EmailField(unique=True, verbose_name="Email для розсилки")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "tblNewsletterSubscribers"
        verbose_name = "Підписник на розсилку"
        verbose_name_plural = "Підписники на розсилку"

    def __str__(self):
        return self.email


class TrialLessonRequest(models.Model):
    STATUS = [
        ('new', 'Нова заявка'),
        ('processed', 'Оброблено'),
    ]

    full_name = models.CharField(max_length=100, verbose_name="Ім'я")
    phone = models.CharField(max_length=20, verbose_name="Телефон")
    child_age = models.CharField(max_length=50, verbose_name="Вік дитини", blank=True, null=True)
    course = models.ForeignKey('Course', on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Курс")
    status = models.CharField(max_length=20, choices=STATUS, default='new')
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='trial_requests'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "tblTrialLessons"
        ordering = ['-created_at']
        verbose_name = "Заявка на урок"
        verbose_name_plural = "Заявки на урок"

    def __str__(self):
        return f"{self.full_name} ({self.phone})"


class CourseReview(models.Model):
    REVIEW_TYPE_CHOICES = (
        ('course', 'Відгук на курс'),
        ('school', 'Відгук про школу'),
    )

    review_type = models.CharField(
        max_length=10,
        choices=REVIEW_TYPE_CHOICES,
        default='course',
        verbose_name="Тип відгуку"
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='reviews',
        null=True,
        blank=True
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        verbose_name="Оцінка (1-5)"
    )
    comment = models.TextField(verbose_name="Відгук")
    created_at = models.DateTimeField(auto_now_add=True)
    is_published = models.BooleanField(default=True, verbose_name="Опубліковано")

    class Meta:
        db_table = "tblCourseReviews"
        ordering = ['-created_at']
        verbose_name = "Відгук"
        verbose_name_plural = "Відгуки"
        constraints = [
            models.UniqueConstraint(
                fields=['course', 'user'],
                condition=models.Q(review_type='course'),
                name='unique_course_review_per_user'
            ),
            models.UniqueConstraint(
                fields=['user'],
                condition=models.Q(review_type='school'),
                name='unique_school_review_per_user'
            )
        ]

    def __str__(self):
        if self.review_type == 'school':
            return f"Відгук про школу від {self.user.username} — {self.rating}★"
        return f"Відгук на {self.course.title if self.course else '?'} від {self.user.username} — {self.rating}★"