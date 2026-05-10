export interface ICourseReviewCreate {
    review_type: 'course' | 'school';
    course?: number | null;
    rating: number;
    comment: string;
}
