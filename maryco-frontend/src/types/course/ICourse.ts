import type { ICategory } from '../category/ICategory';
import type { ITeacher } from '../teacher/ITeacher';

export interface IProgramStep {
    title: string;
    description: string;
}

export interface ICourseGroup {
    id: number;
    name: string;
    teachers: ITeacher[];
    schedule: string;
}

export interface ICourse {
    id: number;
    title: string;
    description: string;
    price: string;
    image: string | null;
    category: ICategory;
    teachers: ITeacher[];
    groups: ICourseGroup[];
    age_range: string;
    duration_info: string;
    format_info: string;
    program_steps: IProgramStep[];
    benefits: string[];
    created_at: string;
}