from django.contrib import admin
from .models import Teacher, Course, Student, Category, CourseGroup

class TeacherAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'subject', 'created_at', 'updated_at')
    fields = ('full_name', 'subject', 'experience', 'photo', 'bio')

class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)

class CourseGroupInline(admin.TabularInline):
    model = CourseGroup
    extra = 1

class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'price', 'get_teachers')
    list_filter = ('category', 'teachers')
    filter = ('teachers',)
    fieldsets = (
        ('Основна інформація', {
            'fields': ('title', 'category', 'teachers', 'price', 'image', 'description')
        }),
        ('Деталі', {
            'fields': ('age_range', 'duration_info', 'format_info'),
        }),
        ('Контент сторінки', {
            'description': "Введіть дані у форматі списків JSON",
            'fields': ('benefits', 'program_steps'),
        }),
    )

    def get_teachers(self, obj):
        return ", ".join([t.full_name for t in obj.teachers.all()])

    inlines = [CourseGroupInline]

    get_teachers.short_description = 'Вчителі'

class StudentAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'created_at', 'updated_at')
    filter_horizontal = ('courses',)


class CourseGroupAdmin(admin.ModelAdmin):
    list_display = ('name', 'course', 'get_teachers', 'schedule')
    list_filter = ('course',)
    filter_horizontal = ('teachers',)

    def get_teachers(self, obj):
        return ", ".join([t.full_name for t in obj.teachers.all()])

    get_teachers.short_description = 'Викладачі'

admin.site.register(Teacher, TeacherAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Course, CourseAdmin)
admin.site.register(Student, StudentAdmin)
admin.site.register(CourseGroup, CourseGroupAdmin)