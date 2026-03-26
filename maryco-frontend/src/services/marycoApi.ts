import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "../utils/createBaseQuery.ts";
import type { ICategory } from "../types/category/ICategory.ts";
import type { ITeacher } from "../types/teacher/ITeacher.ts";
import type { ICourse } from "../types/course/ICourse.ts";
import type { IStudent } from "../types/student/IStudent.ts";
import type { ICourseCreate } from "../types/course/ICourseCreate.ts";
import type { ITeacherCreate } from "../types/teacher/ITeacherCreate.ts";
import type { IStudentCreate } from "../types/student/IStudentCreate.ts";

export const marycoApi = createApi({
    reducerPath: 'marycoApi',
    baseQuery: createBaseQuery(""),
    tagTypes: ['Categories', 'Teachers', 'Courses', 'Students'],
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

        getCourseById: builder.query<ICourse, number>({
            query: (id) => ({
                url: `/courses/${id}/`,
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
    }),
});

export const {
    useGetCategoriesQuery,
    useGetTeachersQuery,
    useGetTeacherByIdQuery,
    useCreateTeacherMutation,
    useDeleteTeacherMutation,

    useGetCoursesQuery,
    useGetCourseByIdQuery,
    useGetCoursesByCategoryQuery,
    useCreateCourseMutation,
    useDeleteCourseMutation,

    useGetStudentsQuery,
    useCreateStudentMutation,
    useDeleteStudentMutation,
} = marycoApi;