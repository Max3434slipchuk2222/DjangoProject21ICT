from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Статус та Роль', {'fields': ('role',)}),
    )
    list_display = ('email', 'first_name', 'role', 'is_staff')
    list_filter = ('role', 'is_staff')

admin.site.register(CustomUser, CustomUserAdmin)