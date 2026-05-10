import type {ICourse} from "../course/ICourse.ts";

export interface ITeacher {
    id: number;
    user: number | null;
    full_name: string;
    subject: string;
    bio: string;
    photo: string | null;
    experience: string;
    created_at: string;
    courses?: ICourse[];
}

export interface IStudentShort {
    id: number;
    full_name: string;
}

export interface IGroup {
    id: number;
    name: string;
    course_title: string;
    schedule: string;
    students: IStudentShort[]; // Проблема 6
    students_count: number;
}

export interface ITeacherDashboard extends ITeacher {
    groups: IGroup[];
}