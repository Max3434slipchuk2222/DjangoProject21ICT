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

// ─── Зірки статичні ──────────────────────────────────────────────────────────
function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
                <FaStar
                    key={i}
                    size={size}
                    className={i <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-slate-600'}
                />
            ))}
        </div>
    );
}

// ─── Форма залишити відгук ────────────────────────────────────────────────────
function ReviewForm({ courseId }: { courseId: number }) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');

    const [submitReview, { isLoading, isSuccess, isError, error }] = useSubmitCourseReviewMutation();

    const serverError = (error as any)?.data?.detail
        || (error as any)?.data?.non_field_errors?.[0];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) return;
        await submitReview({
            review_type: 'course',   // завжди 'course' на сторінці курсу
            course: courseId,
            rating,
            comment,
        });
        setRating(0);
        setComment('');
    };

    if (isSuccess) {
        return (
            <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-5 rounded-2xl text-center font-bold">
                Дякуємо! Ваш відгук успішно опубліковано ✓
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Зірки */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                    Ваша оцінка *
                </label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                            className="focus:outline-none"
                        >
                            <FaStar
                                size={30}
                                className={`transition-colors ${
                                    star <= (hover || rating)
                                        ? 'text-yellow-400'
                                        : 'text-gray-300 dark:text-slate-600'
                                }`}
                            />
                        </button>
                    ))}
                </div>
                {rating === 0 && (
                    <span className="text-xs text-gray-400">Оберіть від 1 до 5 зірок</span>
                )}
            </div>

            {/* Текст */}
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
    );
}

// ─── Головний компонент ───────────────────────────────────────────────────────
export default function CourseReviews({ courseId, reviews = [], averageRating }: CourseReviewsProps) {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

    // Перевіряємо чи поточний юзер вже залишив відгук на цей курс
    const alreadyReviewed = reviews.some(
        (r) => r.review_type === 'course' && r.user.id === user?.id
    );

    return (
        <div className="mt-16 bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-slate-800 transition-colors">

            {/* Заголовок + середня оцінка */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-gray-100 dark:border-slate-800 gap-4">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                    Відгуки ({reviews.length})
                </h3>
                {reviews.length > 0 && (
                    <div className="flex items-center gap-4 bg-gray-50 dark:bg-slate-800 px-6 py-3 rounded-2xl">
                        <div className="text-3xl font-black text-blue-600 dark:text-blue-400">
                            {averageRating ? averageRating.toFixed(1) : '0.0'}
                        </div>
                        <div className="flex flex-col gap-1">
                            <StarRow rating={Math.round(averageRating || 0)} size={16} />
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-bold">
                                {reviews.length} {reviews.length === 1 ? 'відгук' : reviews.length < 5 ? 'відгуки' : 'відгуків'}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Список відгуків */}
            <div className="mb-12 space-y-5">
                {reviews.length === 0 ? (
                    <p className="text-gray-400 dark:text-gray-500 text-center italic py-6">
                        Поки що немає відгуків. Будьте першим!
                    </p>
                ) : (
                    reviews.map((review) => {
                        const displayName = review.user.first_name
                            ? `${review.user.first_name} ${review.user.last_name || ''}`.trim()
                            : review.user.username;
                        const isOwn = review.user.id === user?.id;

                        return (
                            <div
                                key={review.id}
                                className={`p-5 rounded-2xl transition-colors ${
                                    isOwn
                                        ? 'bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30'
                                        : 'bg-gray-50 dark:bg-slate-800/50'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-3 gap-2">
                                    <div className="flex items-center gap-3">
                                        {/* Аватар */}
                                        <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-black text-sm flex-shrink-0">
                                            {displayName.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                                                    {displayName}
                                                </h4>
                                                {isOwn && (
                                                    <span className="text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                                                        Ви
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-xs text-gray-400 dark:text-gray-500">
                                                {new Date(review.created_at).toLocaleDateString('uk-UA', {
                                                    day: 'numeric', month: 'long', year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                    <StarRow rating={review.rating} />
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed pl-12">
                                    {review.comment}
                                </p>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Блок форми */}
            <div className="bg-gray-50 dark:bg-slate-800/60 p-7 rounded-3xl border border-gray-100 dark:border-slate-700">
                <h4 className="text-lg font-black text-gray-900 dark:text-white mb-5">
                    Залишити відгук
                </h4>

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
                    <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-4 rounded-xl text-center font-bold">
                        Ви вже залишали відгук на цей курс ✓
                    </div>
                )}

                {/* Форма */}
                {isAuthenticated && !alreadyReviewed && (
                    <ReviewForm courseId={courseId} />
                )}
            </div>
        </div>
    );
}