import type {ICourse} from "../course/ICourse.ts";

export interface ITeacher {
    id: number;
    user?: number | null;
    full_name: string;
    subject: string;
    bio: string;
    photo: string | null;
    experience: string;
    created_at: string;
    courses?: ICourse[]
}