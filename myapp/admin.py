from django.contrib import admin
from .models import Teacher, Course, Student

class TeacherAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'created_at', 'updated_at')

class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at', 'updated_at')

class StudentAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'created_at', 'updated_at')

admin.site.register(Teacher, TeacherAdmin)
admin.site.register(Course, CourseAdmin)
admin.site.register(Student, StudentAdmin)