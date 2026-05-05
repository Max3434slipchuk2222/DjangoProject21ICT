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
        <div className="mt-16 bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-slate-800 transition-colors">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 pb-6 border-b border-gray-100 dark:border-slate-800 gap-4 transition-colors">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white transition-colors">Відгуки до курсу</h3>

                <div className="flex items-center gap-4 bg-gray-50 dark:bg-slate-800 px-6 py-3 rounded-2xl transition-colors">
                    <div className="text-3xl font-black text-blue-600 dark:text-blue-400 transition-colors">
                        {averageRating ? averageRating.toFixed(1) : '0.0'}
                    </div>
                    <div className="flex flex-col">
                        <div className="flex text-yellow-400 text-lg">
                            {[...Array(5)].map((_, i) => (
                                <FaStar key={i} className={i < Math.round(averageRating || 0) ? "text-yellow-400" : "text-gray-300 dark:text-slate-600"} />
                            ))}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-bold mt-1 transition-colors">
                            На основі {reviews.length} відгуків
                        </span>
                    </div>
                </div>
            </div>

            <div className="mb-12 space-y-6">
                {reviews.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center italic py-4 transition-colors">Поки що немає відгуків. Будьте першим!</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-2xl transition-colors">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white transition-colors">
                                        {review.author_name || "Анонімний користувач"}
                                    </h4>
                                    <span className="text-xs text-gray-400 dark:text-gray-500 transition-colors">
                                        {new Date(review.created_at).toLocaleDateString('uk-UA')}
                                    </span>
                                </div>
                                <div className="flex text-yellow-400 text-sm">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300 dark:text-slate-600"} />
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed transition-colors">{review.comment}</p>
                        </div>
                    ))
                )}
            </div>

            <div className="bg-blue-50/50 dark:bg-slate-800/80 p-8 rounded-3xl border border-blue-100 dark:border-slate-700 transition-colors">
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">Залишити свій відгук</h4>

                {isSuccess ? (
                    <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-4 rounded-xl text-center font-bold transition-colors">
                        Дякуємо за ваш відгук! Він успішно доданий.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 transition-colors">Ваша оцінка *</label>
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
                                                className={`transition-colors duration-200 ${ratingValue <= (hover || rating) ? "text-yellow-400" : "text-gray-200 dark:text-slate-600"}`}
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
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 transition-colors">Ваше ім'я (необов'язково)</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Як до вас звертатись?"
                                    className="px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 transition-colors">Ваш коментар *</label>
                            <textarea
                                required
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Що вам сподобалося найбільше?"
                                rows={4}
                                className="px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 dark:focus:border-blue-500 outline-none resize-none transition-colors"
                            ></textarea>
                        </div>

                        {isError && <p className="text-red-500 dark:text-red-400 text-sm font-bold transition-colors">Сталася помилка при відправці.</p>}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 mt-2"
                        >
                            {isLoading ? 'Відправка...' : 'Відправити відгук'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}