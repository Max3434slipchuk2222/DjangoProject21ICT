export interface ICourseReviewUser {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
}

export interface ICourseReview {
    id: number;
    course: number;
    user: ICourseReviewUser;
    rating: number;
    comment: string;
    created_at: string;
}
