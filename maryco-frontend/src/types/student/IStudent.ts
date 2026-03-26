import type { ICourse } from '../course/ICourse'

export interface IStudent {
    id: number
    full_name: string
    courses: ICourse[]
    created_at: string
}