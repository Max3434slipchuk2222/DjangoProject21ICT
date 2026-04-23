export interface IPromotion {
    id: number
    title: string
    description: string
    discount: string
    image: string | null
    valid_until: string | null
    is_active: boolean
    created_at: string
}