export interface ITeacherCreate {
    full_name: string;
    subject: string;
    experience?: string;
    bio?: string;
    photo?: File | null;
}