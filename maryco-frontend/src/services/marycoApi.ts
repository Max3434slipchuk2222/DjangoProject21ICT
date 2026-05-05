import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "../utils/createBaseQuery.ts";
import type { ICategory } from "../types/category/ICategory.ts";
import type { ITeacher } from "../types/teacher/ITeacher.ts";
import type { ICourse } from "../types/course/ICourse.ts";
import type { IStudent } from "../types/student/IStudent.ts";
import type { ICourseCreate } from "../types/course/ICourseCreate.ts";
import type { ITeacherCreate } from "../types/teacher/ITeacherCreate.ts";
import type { IStudentCreate } from "../types/student/IStudentCreate.ts";
import type {IPromotion} from "../types/promotion/IPromotion.ts";
import type {INews} from "../types/news/INews.ts";
import type { INewsletterCreate } from "../types/newsletter/INewsletterCreate.ts";
import type { ITrialLessonCreate } from "../types/trial/ITrialLessonCreate.ts";
import type { ICourseReviewCreate } from "../types/review/ICourseReviewCreate.ts";

export const marycoApi = createApi({
    reducerPath: 'marycoApi',
    baseQuery: createBaseQuery(""),
    tagTypes: ['Categories', 'Teachers', 'Courses', 'Students', 'News', 'Promotions'],
    endpoints: (builder) => ({

        getCategories: builder.query<ICategory[], void>({
            query: () => ({
                url: '/categories/',
                method: 'GET',
            }),
            providesTags: ['Categories'],
        }),

        getTeachers: builder.query<ITeacher[], void>({
            query: () => ({
                url: '/teachers/',
                method: 'GET',
            }),
            providesTags: ['Teachers'],
        }),

        getTeacherById: builder.query<ITeacher, number>({
            query: (id) => ({
                url: `/teachers/${id}/`,
                method: 'GET',
            }),
            providesTags: ['Teachers'],
        }),

        createTeacher: builder.mutation<void, ITeacherCreate>({
            query: (body) => ({
                url: '/teachers/',
                method: 'POST',
                body: body,
            }),
            invalidatesTags: ['Teachers'],
        }),

        deleteTeacher: builder.mutation<void, number>({
            query: (id) => ({
                url: `/teachers/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Teachers'],
        }),

        getCourses: builder.query<ICourse[], void>({
            query: () => ({
                url: '/courses/',
                method: 'GET',
            }),
            providesTags: ['Courses'],
        }),

        getCourseBySlug: builder.query<ICourse, string>({
            query: (slug) => ({
                url: `/courses/${slug}/`,
                method: 'GET',
            }),
            providesTags: ['Courses'],
        }),

        getCoursesByCategory: builder.query<ICourse[], number>({
            query: (categoryId) => ({
                url: `/courses/?category=${categoryId}`,
                method: 'GET',
            }),
            providesTags: ['Courses'],
        }),

        createCourse: builder.mutation<void, ICourseCreate>({
            query: (body) => ({
                url: '/courses/',
                method: 'POST',
                body: body,
            }),
            invalidatesTags: ['Courses'],
        }),

        deleteCourse: builder.mutation<void, number>({
            query: (id) => ({
                url: `/courses/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Courses'],
        }),

        getStudents: builder.query<IStudent[], void>({
            query: () => ({
                url: '/students/',
                method: 'GET',
            }),
            providesTags: ['Students'],
        }),

        createStudent: builder.mutation<void, IStudentCreate>({
            query: (body) => ({
                url: '/students/',
                method: 'POST',
                body: body,
            }),
            invalidatesTags: ['Students'],
        }),

        deleteStudent: builder.mutation<void, number>({
            query: (id) => ({
                url: `/students/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Students'],
        }),
        getNews: builder.query<INews[], void>({
            query: () => ({
                url: '/news/',
                method: 'GET',
            }),
            providesTags: ['News'],
        }),

        getPromotions: builder.query<IPromotion[], void>({
            query: () => ({
                url: '/promotions/',
                method: 'GET',
            }),
            providesTags: ['Promotions'],
        }),
        subscribeNewsletter: builder.mutation<void, INewsletterCreate>({
            query: (body) => ({
                url: '/newsletter/',
                method: 'POST',
                body: body,
            }),
        }),

        submitTrialLesson: builder.mutation<void, ITrialLessonCreate>({
            query: (body) => ({
                url: '/trial-lessons/',
                method: 'POST',
                body: body,
            }),
        }),

        submitCourseReview: builder.mutation<void, ICourseReviewCreate>({
            query: (body) => ({
                url: '/reviews/',
                method: 'POST',
                body: body,
            }),
            invalidatesTags: ['Courses'],
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useGetTeachersQuery,
    useGetNewsQuery,
    useGetPromotionsQuery,
    useGetCoursesQuery,
    useGetCourseBySlugQuery,
    useSubscribeNewsletterMutation,
    useSubmitTrialLessonMutation,
    useSubmitCourseReviewMutation,

} = marycoApi;