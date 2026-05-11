export interface ITrialLesson {
    id: number;
    full_name: string;
    phone: string;
    child_age: string | null;
    course: number | null;
    course_name?: string;
    status: 'new' | 'processed';
    created_at: string;
}