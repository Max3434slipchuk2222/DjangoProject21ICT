import type { ICategory } from '../category/ICategory'
import type { ITeacher } from '../teacher/ITeacher'

export interface ICourse {
    id: number
    title: string
    description: string
    price: string
    image: string | null
    category: ICategory
    teacher: ITeacher
    created_at: string
}