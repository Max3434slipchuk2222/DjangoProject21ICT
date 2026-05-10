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
import type {ILoginResponse} from "../types/auth/ILoginResponse.ts";
import type {ILoginRequest} from "../types/auth/ILoginRequest.ts";
import type {IRegisterRequest} from "../types/auth/IRegisterRequest.ts";
import type {IUser} from "../types/auth/IUser.ts";
import type {ICourseReview} from "../types/review/ICourseReview.ts";

export const marycoApi = createApi({
    reducerPath: 'marycoApi',
    baseQuery: createBaseQuery(''),
    tagTypes: ['Categories', 'Teachers', 'Courses', 'Students', 'News', 'Promotions', 'Reviews', 'Me'],
    endpoints: (builder) => ({

        login: builder.mutation<ILoginResponse, ILoginRequest>({
            query: (body) => ({
                url: 'auth/login/',
                method: 'POST',
                body,
            }),
        }),
        register: builder.mutation<ILoginResponse, IRegisterRequest>({
            query: (body) => ({
                url: 'auth/register/',
                method: 'POST',
                body,
            }),
        }),
        getMe: builder.query<IUser, void>({
            query: () => ({
                url: 'auth/me/',
                method: 'GET',
            }),
            providesTags: ['Me'],
        }),
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
        getReviews: builder.query<ICourseReview[], { teacherId?: number } | void>({
            query: (params) => ({
                url: '/reviews/',
                method: 'GET',
                params: params?.teacherId ? { teacher: params.teacherId } : {},
            }),
            providesTags: ['Reviews'],
        }),

        submitCourseReview: builder.mutation<ICourseReview, ICourseReviewCreate>({
            query: (body) => ({
                url: '/reviews/',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Courses', 'Reviews'],
        }),
        getTeacherDashboard: builder.query<any, void>({
            query: () => ({
                url: '/teachers/dashboard/',
                method: 'GET',
            }),
            providesTags: ['Teachers'],
        }),
        forgotPassword: builder.mutation<void, { email: string }>({
            query: (body) => ({
                url: 'auth/password_reset/',
                method: 'POST',
                body,
            }),
        }),
        resetPasswordConfirm: builder.mutation<void, { token: string; password: string }>({
            query: (body) => ({
                url: 'auth/password_reset/confirm/',
                method: 'POST',
                body,
            }),
        }),
        googleLogin: builder.mutation<ILoginResponse, { access_token: string }>({
            query: (body) => ({
                url: 'auth/google/',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Me'],
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
    useGetReviewsQuery,
    useSubmitCourseReviewMutation,
    useLoginMutation,
    useRegisterMutation,
    useGetMeQuery,
    useGetTeacherDashboardQuery,
    useForgotPasswordMutation,
    useResetPasswordConfirmMutation,
    useGoogleLoginMutation

} = marycoApi;