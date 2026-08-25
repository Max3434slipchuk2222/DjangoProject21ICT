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
import type {ITeacherUpdate} from "../types/teacher/ITeacherUpdate.ts";
import type {ICourseUpdate} from "../types/course/ICourseUpdate.ts";
import type {INewsCreate} from "../types/news/INewsCreate.ts";
import type {IPromotionCreate} from "../types/promotion/IPromotionCreate.ts";
import type {ITrialLesson} from "../types/trial/ITrialLesson.ts";

export const marycoApi = createApi({
    reducerPath: 'marycoApi',
    baseQuery: createBaseQuery(''),
    tagTypes: ['Categories', 'Teachers', 'Courses', 'Students', 'News', 'Promotions', 'Reviews', 'Me', 'Trials'],
    refetchOnFocus: true,
    refetchOnReconnect: true,
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
        logoutApi: builder.mutation<void, { refresh: string }>({
            query: (body) => ({
                url: 'auth/logout/',
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
        updateUserProfile: builder.mutation<IUser, Partial<IUser>>({
            query: (body) => ({
                url: 'auth/me/',
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['Me'],
        }),
        changePassword: builder.mutation<void, any>({
            query: (body) => ({
                url: 'auth/password/change/',
                method: 'POST',
                body,
            }),
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

        updateTeacher: builder.mutation<ITeacher, { id: number; data: ITeacherUpdate }>({
            query: ({ id, data }) => ({ url: `/teachers/${id}/`, method: 'PATCH', body: data }),
            invalidatesTags: ['Teachers'],
        }),

        deleteTeacher: builder.mutation<void, number>({
            query: (id) => ({ url: `/teachers/${id}/`, method: 'DELETE' }),
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
        updateCourse: builder.mutation<ICourse, { slug: string; data: ICourseUpdate }>({
            query: ({ slug, data }) => ({ url: `/courses/${slug}/`, method: 'PATCH', body: data }),
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
        updateStudent: builder.mutation<IStudent, { id: number; data: Partial<IStudentCreate> }>({
            query: ({ id, data }) => ({ url: `/students/${id}/`, method: 'PATCH', body: data }),
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
        createNews: builder.mutation<INews, INewsCreate>({
            query: (body) => ({ url: '/news/', method: 'POST', body }),
            invalidatesTags: ['News'],
        }),
        updateNews: builder.mutation<INews, { id: number; data: Partial<INewsCreate> }>({
            query: ({ id, data }) => ({ url: `/news/${id}/`, method: 'PATCH', body: data }),
            invalidatesTags: ['News'],
        }),
        deleteNews: builder.mutation<void, number>({
            query: (id) => ({ url: `/news/${id}/`, method: 'DELETE' }),
            invalidatesTags: ['News'],
        }),

        getPromotions: builder.query<IPromotion[], void>({
            query: () => ({
                url: '/promotions/',
                method: 'GET',
            }),
            providesTags: ['Promotions'],
        }),
        createPromotion: builder.mutation<IPromotion, IPromotionCreate>({
            query: (body) => ({ url: '/promotions/', method: 'POST', body }),
            invalidatesTags: ['Promotions'],
        }),
        updatePromotion: builder.mutation<IPromotion, { id: number; data: Partial<IPromotionCreate> }>({
            query: ({ id, data }) => ({ url: `/promotions/${id}/`, method: 'PATCH', body: data }),
            invalidatesTags: ['Promotions'],
        }),
        deletePromotion: builder.mutation<void, number>({
            query: (id) => ({ url: `/promotions/${id}/`, method: 'DELETE' }),
            invalidatesTags: ['Promotions'],
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
        getTrialLessons: builder.query<ITrialLesson[], void>({
            query: () => ({ url: '/trial-lessons/', method: 'GET' }),
            providesTags: ['Trials'],
        }),
        setTrialStatus: builder.mutation<ITrialLesson, { id: number; status: 'new' | 'processed' }>({
            query: ({ id, status }) => ({
                url: `/trial-lessons/${id}/set-status/`,
                method: 'PATCH',
                body: { status },
            }),
            invalidatesTags: ['Trials'],
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
        toggleReviewPublish: builder.mutation<ICourseReview, number>({
            query: (id) => ({ url: `/reviews/${id}/toggle-publish/`, method: 'PATCH' }),
            invalidatesTags: ['Reviews'],
        }),
        deleteReview: builder.mutation<void, number>({
            query: (id) => ({ url: `/reviews/${id}/`, method: 'DELETE' }),
            invalidatesTags: ['Reviews'],
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
        googleLogin: builder.mutation<ILoginResponse, { code: string }>({
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
    useLoginMutation,
    useRegisterMutation,
    useGetMeQuery,
    useForgotPasswordMutation,
    useResetPasswordConfirmMutation,
    useGoogleLoginMutation,
    useGetCategoriesQuery,
    useGetTeachersQuery,
    useGetTeacherByIdQuery,
    useCreateTeacherMutation,
    useUpdateTeacherMutation,
    useDeleteTeacherMutation,
    useGetTeacherDashboardQuery,
    useGetCoursesQuery,
    useGetCourseBySlugQuery,
    useGetCoursesByCategoryQuery,
    useCreateCourseMutation,
    useUpdateCourseMutation,
    useDeleteCourseMutation,
    useGetStudentsQuery,
    useCreateStudentMutation,
    useUpdateStudentMutation,
    useDeleteStudentMutation,
    useGetNewsQuery,
    useCreateNewsMutation,
    useUpdateNewsMutation,
    useDeleteNewsMutation,
    useGetPromotionsQuery,
    useCreatePromotionMutation,
    useUpdatePromotionMutation,
    useDeletePromotionMutation,
    useSubscribeNewsletterMutation,
    useSubmitTrialLessonMutation,
    useGetTrialLessonsQuery,
    useSetTrialStatusMutation,
    useGetReviewsQuery,
    useSubmitCourseReviewMutation,
    useToggleReviewPublishMutation,
    useDeleteReviewMutation,
    useUpdateUserProfileMutation,
    useChangePasswordMutation


} = marycoApi;