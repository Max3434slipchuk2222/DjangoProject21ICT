export interface ICourseCreate {
    title: string;
    slug?: string;
    description?: string;
    price: string;
    category?: string | number;
    is_active?: string | boolean;
    image?: File | null;
}