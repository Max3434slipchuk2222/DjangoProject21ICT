import { useState } from 'react';
import { FaStar } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useSubmitCourseReviewMutation } from '../services/marycoApi';
import type { ICourseReview } from '../types/review/ICourseReview';
import type { RootState } from '../store';

interface CourseReviewsProps {
    courseId: number;
    reviews?: ICourseReview[];
    averageRating?: number | null;
}

export default function CourseReviews({ courseId, reviews = [], averageRating }: CourseReviewsProps) {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');

    const [submitReview, { isLoading, isSuccess, isError, error }] = useSubmitCourseReviewMutation();

    // Перевіряємо чи поточний юзер вже залишив відгук
    const alreadyReviewed = reviews.some((r) => r.user.id === user?.id);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) return;

        await submitReview({
            course: courseId,
            rating,
            comment,
        });

        setRating(0);
        setComment('');
    };

    // Серверна помилка (наприклад "вже залишали відгук")
    const serverError = (error as any)?.data?.detail || (error as any)?.data?.non_field_errors?.[0];

    return (
        <div className="mt-16 bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-slate-800 transition-colors">

            {/* Заголовок + середня оцінка */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 pb-6 border-b border-gray-100 dark:border-slate-800 gap-4">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">Відгуки до курсу</h3>
                <div className="flex items-center gap-4 bg-gray-50 dark:bg-slate-800 px-6 py-3 rounded-2xl">
                    <div className="text-3xl font-black text-blue-600 dark:text-blue-400">
                        {averageRating ? averageRating.toFixed(1) : '0.0'}
                    </div>
                    <div className="flex flex-col">
                        <div className="flex text-yellow-400 text-lg">
                            {[...Array(5)].map((_, i) => (
                                <FaStar
                                    key={i}
                                    className={i < Math.round(averageRating || 0) ? 'text-yellow-400' : 'text-gray-300 dark:text-slate-600'}
                                />
                            ))}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-bold mt-1">
                            На основі {reviews.length} відгуків
                        </span>
                    </div>
                </div>
            </div>

            {/* Список відгуків */}
            <div className="mb-12 space-y-6">
                {reviews.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center italic py-4">
                        Поки що немає відгуків. Будьте першим!
                    </p>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-2xl transition-colors">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    {/* Аватар-заглушка з першою літерою імені */}
                                    <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-black text-sm flex-shrink-0">
                                        {(review.user.first_name || review.user.username).charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white">
                                            {review.user.first_name
                                                ? `${review.user.first_name} ${review.user.last_name || ''}`.trim()
                                                : review.user.username}
                                        </h4>
                                        <span className="text-xs text-gray-400 dark:text-gray-500">
                                            {new Date(review.created_at).toLocaleDateString('uk-UA')}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex text-yellow-400 text-sm">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar
                                            key={i}
                                            className={i < review.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-slate-600'}
                                        />
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                {review.comment}
                            </p>
                        </div>
                    ))
                )}
            </div>

            {/* Блок форми */}
            <div className="bg-blue-50/50 dark:bg-slate-800/80 p-8 rounded-3xl border border-blue-100 dark:border-slate-700">
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Залишити свій відгук</h4>

                {/* Не авторизований */}
                {!isAuthenticated && (
                    <div className="text-center py-6">
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                            Щоб залишити відгук, потрібно увійти в акаунт
                        </p>
                        <Link
                            to="/login"
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition-colors"
                        >
                            Увійти
                        </Link>
                    </div>
                )}

                {/* Вже залишив відгук */}
                {isAuthenticated && alreadyReviewed && (
                    <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 p-4 rounded-xl text-center font-bold">
                        Ви вже залишали відгук на цей курс ✓
                    </div>
                )}

                {/* Успішно відправлено */}
                {isAuthenticated && !alreadyReviewed && isSuccess && (
                    <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-4 rounded-xl text-center font-bold">
                        Дякуємо за ваш відгук! Він успішно доданий ✓
                    </div>
                )}

                {/* Форма */}
                {isAuthenticated && !alreadyReviewed && !isSuccess && (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                        {/* Зірки */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                Ваша оцінка *
                            </label>
                            <div className="flex gap-2">
                                {[...Array(5)].map((_, index) => {
                                    const ratingValue = index + 1;
                                    return (
                                        <label key={index} className="cursor-pointer">
                                            <input
                                                type="radio"
                                                name="rating"
                                                value={ratingValue}
                                                className="hidden"
                                                onClick={() => setRating(ratingValue)}
                                            />
                                            <FaStar
                                                size={32}
                                                className={`transition-colors ${
                                                    ratingValue <= (hover || rating)
                                                        ? 'text-yellow-400'
                                                        : 'text-gray-300 dark:text-slate-600'
                                                }`}
                                                onMouseEnter={() => setHover(ratingValue)}
                                                onMouseLeave={() => setHover(0)}
                                            />
                                        </label>
                                    );
                                })}
                            </div>
                            {rating === 0 && (
                                <span className="text-xs text-gray-400">Оберіть від 1 до 5 зірок</span>
                            )}
                        </div>

                        {/* Текст відгуку */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                Ваш відгук *
                            </label>
                            <textarea
                                required
                                rows={4}
                                placeholder="Поділіться своїми враженнями про курс..."
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all resize-none"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </div>

                        {/* Серверна помилка */}
                        {isError && (
                            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm font-bold">
                                {serverError || 'Помилка при відправці. Спробуйте ще раз.'}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || rating === 0}
                            className="self-start bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-3.5 rounded-xl transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                            {isLoading ? 'Відправка...' : 'Опублікувати відгук'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}