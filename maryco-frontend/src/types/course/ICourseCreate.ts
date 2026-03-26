export interface ICourseCreate {
    title: string
    description: string
    price: string
    category_id: number
    teacher_id: number
    image?: File | null
}