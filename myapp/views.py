from django.shortcuts import render, get_object_or_404
from .models import Teacher, Course, Student, Category


def get_base_context():
    return {
        'categories': Category.objects.all(),
    }


def home(request):
    ctx = get_base_context()
    ctx.update({
        'popular_courses': Course.objects.all()[:6],
        'teachers': Teacher.objects.all()[:4],
    })
    return render(request, 'pages/home.html', ctx)


def courses(request):
    ctx = get_base_context()
    ctx.update({
        'courses': Course.objects.all(),
        'current_category': None,
    })
    return render(request, 'pages/courses.html', ctx)

def category_courses(request, category_id):
    category = get_object_or_404(Category, id=category_id)
    ctx = get_base_context()
    ctx.update({
        'courses': Course.objects.filter(category=category).select_related('category', 'teacher'),
        'current_category': category,
    })
    return render(request, 'pages/courses.html', ctx)


def teachers(request):
    ctx = get_base_context()
    ctx.update({
        'teachers': Teacher.objects.all(),
    })
    return render(request, 'pages/teachers.html', ctx)


def contact(request):
    ctx = get_base_context()
    return render(request, 'pages/contact.html', ctx)


def about(request):
    ctx = get_base_context()
    return render(request, 'pages/contact.html', ctx)