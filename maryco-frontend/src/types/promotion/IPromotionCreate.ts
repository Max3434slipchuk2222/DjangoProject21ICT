export interface IPromotionCreate {
    title: string;
    description: string;
    discount: string;
    valid_until?: string | null;
    is_active?: boolean;
}