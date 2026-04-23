import { useState } from 'react';
import { FaStar } from 'react-icons/fa6';
import { useSubmitCourseReviewMutation } from '../services/marycoApi';
import type { ICourseReview } from '../types/review/ICourseReview';

interface CourseReviewsProps {
    courseId: number;
    reviews?: ICourseReview[];
    averageRating?: number | null;
}

export default function CourseReviews({ courseId, reviews = [], averageRating }: CourseReviewsProps) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [name, setName] = useState('');
    const [comment, setComment] = useState('');

    const [submitReview, { isLoading, isSuccess, isError }] = useSubmitCourseReviewMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            alert('Будь ласка, оберіть оцінку від 1 до 5 зірок!');
            return;
        }

        await submitReview({
            course: courseId,
            author_name: name || 'Анонім',
            rating: rating,
            comment: comment
        });

        setRating(0);
        setName('');
        setComment('');
    };

    return (
        <div className="mt-16 bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 pb-6 border-b border-gray-100 gap-4">
                <h3 className="text-2xl font-black text-gray-900">Відгуки до курсу</h3>

                <div className="flex items-center gap-4 bg-gray-50 px-6 py-3 rounded-2xl">
                    <div className="text-3xl font-black text-blue-600">
                        {averageRating ? averageRating.toFixed(1) : '0.0'}
                    </div>
                    <div className="flex flex-col">
                        <div className="flex text-yellow-400 text-lg">
                            {[...Array(5)].map((_, i) => (
                                <FaStar key={i} className={i < Math.round(averageRating || 0) ? "text-yellow-400" : "text-gray-300"} />
                            ))}
                        </div>
                        <span className="text-xs text-gray-500 font-bold mt-1">
                            На основі {reviews.length} відгуків
                        </span>
                    </div>
                </div>
            </div>

            <div className="mb-12 space-y-6">
                {reviews.length === 0 ? (
                    <p className="text-gray-500 text-center italic py-4">Поки що немає відгуків. Будьте першим!</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="bg-gray-50 p-6 rounded-2xl">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h4 className="font-bold text-gray-900">{review.author_name}</h4>
                                    <span className="text-xs text-gray-400">
                                        {new Date(review.created_at).toLocaleDateString('uk-UA')}
                                    </span>
                                </div>
                                <div className="flex text-yellow-400 text-sm">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"} />
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                        </div>
                    ))
                )}
            </div>

            <div className="bg-blue-50/50 p-8 rounded-3xl border border-blue-100">
                <h4 className="text-xl font-bold text-gray-900 mb-6">Залишити свій відгук</h4>

                {isSuccess ? (
                    <div className="bg-green-100 text-green-700 p-4 rounded-xl text-center font-bold">
                        Дякуємо за ваш відгук! Він успішно доданий.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-700">Ваша оцінка *</label>
                            <div className="flex gap-2">
                                {[...Array(5)].map((_, index) => {
                                    const ratingValue = index + 1;
                                    return (
                                        <label key={index} className="cursor-pointer">
                                            <input
                                                type="radio"
                                                className="hidden"
                                                value={ratingValue}
                                                onClick={() => setRating(ratingValue)}
                                            />
                                            <FaStar
                                                size={32}
                                                className="transition-colors duration-200"
                                                color={ratingValue <= (hover || rating) ? "#facc15" : "#e5e7eb"} // жовтий або сірий
                                                onMouseEnter={() => setHover(ratingValue)}
                                                onMouseLeave={() => setHover(0)}
                                            />
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-gray-700">Ваше ім'я (необов'язково)</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Як до вас звертатись?"
                                    className="px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-700">Ваш коментар *</label>
                            <textarea
                                required
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Що вам сподобалося найбільше?"
                                rows={4}
                                className="px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none resize-none"
                            ></textarea>
                        </div>

                        {isError && <p className="text-red-500 text-sm font-bold">Сталася помилка при відправці.</p>}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 mt-2"
                        >
                            {isLoading ? 'Відправка...' : 'Відправити відгук'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}