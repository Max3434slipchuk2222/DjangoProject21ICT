from django.contrib import admin
from .models import Teacher, Course, Student, Category


class TeacherAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'subject', 'created_at', 'updated_at')


class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)


class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'price', 'teacher')
    list_filter = ('category', 'teacher')


class StudentAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'created_at', 'updated_at')
    filter_horizontal = ('courses',)


admin.site.register(Teacher, TeacherAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Course, CourseAdmin)
admin.site.register(Student, StudentAdmin)