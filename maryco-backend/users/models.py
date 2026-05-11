from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('user', 'Простий користувач'),
        ('teacher', 'Вчитель'),
        ('admin', 'Адміністратор'),
    )
    email = models.EmailField(unique=True)

    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name']

    def __str__(self):
        name = self.first_name if self.first_name else self.email
        return f"{name} ({self.get_role_display()})"

    def save(self, *args, **kwargs):
        if self.role == 'admin':
            self.is_staff = True
            self.is_superuser = True
        if not self.username or self.username == "":
            self.username = self.email
        super().save(*args, **kwargs)