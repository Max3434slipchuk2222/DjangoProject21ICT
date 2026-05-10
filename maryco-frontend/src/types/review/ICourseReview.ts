export interface ICourseReviewUser {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
}

export interface ICourseReview {
    id: number;
    review_type: 'course' | 'school';
    course: number | null;
    user: ICourseReviewUser;
    rating: number;
    comment: string;
    created_at: string;
}
