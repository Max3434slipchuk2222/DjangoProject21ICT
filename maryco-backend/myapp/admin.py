from django.contrib import admin
from .models import Teacher, Course, Student, Category, CourseGroup, Promotion, News, TrialLessonRequest, CourseReview, \
    NewsletterSubscriber


class TeacherAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'subject', 'created_at', 'updated_at')
    fields = ('full_name', 'subject', 'experience', 'photo', 'bio')

class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

class CourseGroupInline(admin.TabularInline):
    model = CourseGroup
    extra = 1

class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'price', 'get_teachers')
    prepopulated_fields = {'slug': ('title',)}
    list_filter = ('category', 'teachers')
    filter = ('teachers',)
    fieldsets = (
        ('Основна інформація', {
            'fields': ('title', 'slug', 'category', 'teachers', 'price', 'image', 'description')
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

class NewsAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at', 'is_published')
    list_filter = ('is_published',)
    list_editable = ('is_published',)


class PromotionAdmin(admin.ModelAdmin):
    list_display = ('title', 'discount', 'valid_until', 'is_active')
    list_filter = ('is_active',)
    list_editable = ('is_active',)


class NewsletterSubscriberAdmin(admin.ModelAdmin):
    list_display = ('email', 'created_at')
    search_fields = ('email',)
    date_hierarchy = 'created_at'


class TrialLessonAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'phone', 'course', 'child_age', 'status', 'created_at')
    list_editable = ('status',)
    list_filter = ('status', 'course', 'created_at')

class CourseReviewAdmin(admin.ModelAdmin):
    list_display = ('course', 'user', 'rating', 'created_at', 'is_published')

    list_editable = ('is_published',)

    list_filter = ('course', 'rating', 'is_published')


    search_fields = ('comment', 'user__email')

    readonly_fields = ('created_at',)


admin.site.register(Teacher, TeacherAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Course, CourseAdmin)
admin.site.register(Student, StudentAdmin)
admin.site.register(CourseGroup, CourseGroupAdmin)
admin.site.register(News, NewsAdmin)
admin.site.register(Promotion, PromotionAdmin)
admin.site.register(TrialLessonRequest, TrialLessonAdmin)
admin.site.register(CourseReview, CourseReviewAdmin)
admin.site.register(NewsletterSubscriber, NewsletterSubscriberAdmin)