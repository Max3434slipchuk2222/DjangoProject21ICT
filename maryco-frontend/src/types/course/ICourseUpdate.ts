export interface ICourseUpdate {
    title?: string;
    slug?: string;
    description?: string;
    price?: string;
    category?: string | number;
    is_active?: string | boolean;
    image?: File | null;
    age_range?: string;
    duration_info?: string;
    format_info?: string;
}