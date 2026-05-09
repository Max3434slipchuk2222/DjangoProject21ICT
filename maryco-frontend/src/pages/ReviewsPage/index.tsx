import { useState, useMemo } from 'react';
import { FaStar } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MessageSquarePlus, SlidersHorizontal, TrendingUp, Star, X } from 'lucide-react';
import { useGetReviewsQuery, useGetCoursesQuery, useSubmitCourseReviewMutation } from '../../services/marycoApi';
import type { RootState } from '../../store';

// ─── Зірки інтерактивні ──────────────────────────────────────────────────────
function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
    const [hover, setHover] = useState(0);
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onChange(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className="focus:outline-none"
                >
                    <FaStar
                        size={28}
                        className={`transition-colors ${
                            star <= (hover || value) ? 'text-yellow-400' : 'text-gray-300 dark:text-slate-600'
                        }`}
                    />
                </button>
            ))}
        </div>
    );
}

// ─── Зірки статичні ──────────────────────────────────────────────────────────
function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
                <FaStar
                    key={i}
                    size={size}
                    className={i <= rating ? 'text-yellow-400' : 'text-gray-200 dark:text-slate-700'}
                />
            ))}
        </div>
    );
}

// ─── Модалка залишити відгук ─────────────────────────────────────────────────
function LeaveReviewModal({
                              isOpen,
                              onClose,
                              courses,
                              existingReviewCourseIds,
                          }: {
    isOpen: boolean;
    onClose: () => void;
    courses: { id: number; title: string }[];
    userId?: number;
    existingReviewCourseIds: number[];
}) {
    const [courseId, setCourseId] = useState<number | ''>('');
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submit, { isLoading, isSuccess, isError, error, reset }] = useSubmitCourseReviewMutation();

    const availableCourses = courses.filter((c) => !existingReviewCourseIds.includes(c.id));
    const serverError = (error as any)?.data?.detail || (error as any)?.data?.non_field_errors?.[0];

    const handleClose = () => {
        reset();
        setCourseId('');
        setRating(0);
        setComment('');
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!courseId || rating === 0) return;
        await submit({ course: courseId as number, rating, comment });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-slate-800 relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={handleClose}
                    className="absolute top-5 right-5 p-2 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
                >
                    <X size={18} />
                </button>

                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Залишити відгук</h2>

                {isSuccess ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
                        <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">Дякуємо!</p>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">Ваш відгук успішно опубліковано</p>
                        <button
                            onClick={handleClose}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition-colors"
                        >
                            Закрити
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Курс *</label>
                            {availableCourses.length === 0 ? (
                                <p className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-800 px-4 py-3 rounded-xl">
                                    Ви вже залишили відгуки на всі доступні курси
                                </p>
                            ) : (
                                <select
                                    required
                                    value={courseId}
                                    onChange={(e) => setCourseId(Number(e.target.value))}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                                >
                                    <option value="">Оберіть курс...</option>
                                    {availableCourses.map((c) => (
                                        <option key={c.id} value={c.id}>{c.title}</option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Оцінка *</label>
                            <StarPicker value={rating} onChange={setRating} />
                            {rating === 0 && <p className="text-xs text-gray-400 mt-1">Оберіть від 1 до 5 зірок</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Ваш відгук *</label>
                            <textarea
                                required
                                rows={4}
                                placeholder="Поділіться своїми враженнями про курс..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all resize-none"
                            />
                        </div>

                        {isError && (
                            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm font-bold">
                                {serverError || 'Помилка при відправці. Спробуйте ще раз.'}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || rating === 0 || !courseId || availableCourses.length === 0}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                            {isLoading ? 'Відправка...' : 'Опублікувати відгук'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

// ─── Головна сторінка ────────────────────────────────────────────────────────
type SortOption = 'newest' | 'oldest' | 'rating_high' | 'rating_low';

export default function ReviewsPage() {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

    const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const [sort, setSort] = useState<SortOption>('newest');
    const [modalOpen, setModalOpen] = useState(false);
    const [filtersOpen, setFiltersOpen] = useState(false);

    const { data: reviews = [], isLoading } = useGetReviewsQuery();
    const { data: courses = [] } = useGetCoursesQuery();

    // курси на які поточний юзер вже залишив відгук
    const myReviewCourseIds = useMemo(
        () => reviews.filter((r) => r.user.id === user?.id).map((r) => r.course),
        [reviews, user]
    );

    // Статистика
    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
        : '0.0';
    const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: reviews.filter((r) => r.rating === star).length,
        pct: totalReviews > 0 ? (reviews.filter((r) => r.rating === star).length / totalReviews) * 100 : 0,
    }));

    // Фільтрація + сортування
    const filtered = useMemo(() => {
        let result = [...reviews];
        if (selectedCourse !== null) result = result.filter((r) => r.course === selectedCourse);
        if (selectedRating !== null) result = result.filter((r) => r.rating === selectedRating);
        switch (sort) {
            case 'newest':      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break;
            case 'oldest':      result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()); break;
            case 'rating_high': result.sort((a, b) => b.rating - a.rating); break;
            case 'rating_low':  result.sort((a, b) => a.rating - b.rating); break;
        }
        return result;
    }, [reviews, selectedCourse, selectedRating, sort]);

    const hasActiveFilters = selectedCourse !== null || selectedRating !== null;

    return (
        <section className="max-w-6xl mx-auto px-4 py-16 min-h-screen">

            {/* Заголовок */}
            <header className="text-center mb-14">
                <span className="inline-block text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">
                    Думки наших учнів
                </span>
                <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-4">Відгуки</h1>
                <div className="w-24 h-1.5 bg-blue-600 dark:bg-blue-500 mx-auto rounded-full" />
            </header>

            {/* Статистичний блок */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">

                {/* Середня оцінка */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="text-7xl font-black text-blue-600 dark:text-blue-400 leading-none mb-3">
                        {avgRating}
                    </div>
                    <StarRow rating={Math.round(Number(avgRating))} size={22} />
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-bold mt-3">
                        На основі {totalReviews} відгуків
                    </p>
                </div>

                {/* Розподіл по зірках */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col justify-center gap-3">
                    {ratingCounts.map(({ star, count, pct }) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setSelectedRating(selectedRating === star ? null : star)}
                            className="flex items-center gap-3 group w-full"
                        >
                            <span className="text-sm font-bold text-gray-500 dark:text-gray-400 w-3 text-right">{star}</span>
                            <FaStar size={13} className="text-yellow-400 flex-shrink-0" />
                            <div className="flex-1 h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${
                                        selectedRating === star ? 'bg-blue-600' : 'bg-yellow-400 group-hover:bg-yellow-500'
                                    }`}
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                            <span className="text-xs text-gray-400 dark:text-gray-500 w-5 text-right">{count}</span>
                        </button>
                    ))}
                </div>

                {/* CTA */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-8 flex flex-col items-center justify-center text-center text-white">
                    <TrendingUp size={40} className="mb-4 opacity-90" />
                    <h3 className="text-xl font-black mb-2">Поділіться враженнями</h3>
                    <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                        Ваш відгук допоможе іншим учням обрати курс
                    </p>
                    {isAuthenticated ? (
                        <button
                            onClick={() => setModalOpen(true)}
                            className="bg-white text-blue-600 font-black px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors flex items-center gap-2"
                        >
                            <MessageSquarePlus size={18} />
                            Написати відгук
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            state={{ from: { pathname: '/reviews' } }}
                            className="bg-white text-blue-600 font-black px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors"
                        >
                            Увійти та написати
                        </Link>
                    )}
                </div>
            </div>

            {/* Панель фільтрів */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5 mb-8 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">

                    <button
                        onClick={() => setFiltersOpen(!filtersOpen)}
                        className="flex items-center gap-2 font-bold text-gray-700 dark:text-gray-300 sm:hidden"
                    >
                        <SlidersHorizontal size={18} />
                        Фільтри по курсах
                        {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-blue-600" />}
                    </button>

                    <div className={`flex flex-wrap gap-2 ${filtersOpen ? 'flex' : 'hidden sm:flex'}`}>
                        <button
                            onClick={() => setSelectedCourse(null)}
                            className={`px-4 py-1.5 rounded-full font-bold text-sm transition-all ${
                                selectedCourse === null
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                            }`}
                        >
                            Всі курси
                        </button>
                        {courses.map((course) => (
                            <button
                                key={course.id}
                                onClick={() => setSelectedCourse(selectedCourse === course.id ? null : course.id)}
                                className={`px-4 py-1.5 rounded-full font-bold text-sm transition-all ${
                                    selectedCourse === course.id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                                }`}
                            >
                                {course.title}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                        <Star size={15} className="text-gray-400" />
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value as SortOption)}
                            className="text-sm font-bold bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-none rounded-xl px-3 py-2 outline-none cursor-pointer"
                        >
                            <option value="newest">Новіші спочатку</option>
                            <option value="oldest">Старіші спочатку</option>
                            <option value="rating_high">Висока оцінка</option>
                            <option value="rating_low">Низька оцінка</option>
                        </select>
                    </div>
                </div>

                {/* Активні фільтри */}
                {hasActiveFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Активні:</span>
                        {selectedRating !== null && (
                            <button
                                onClick={() => setSelectedRating(null)}
                                className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-xs font-bold px-3 py-1 rounded-full"
                            >
                                {selectedRating}★ <X size={12} />
                            </button>
                        )}
                        {selectedCourse !== null && (
                            <button
                                onClick={() => setSelectedCourse(null)}
                                className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-bold px-3 py-1 rounded-full"
                            >
                                {courses.find((c) => c.id === selectedCourse)?.title} <X size={12} />
                            </button>
                        )}
                        <button
                            onClick={() => { setSelectedCourse(null); setSelectedRating(null); }}
                            className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 underline ml-1"
                        >
                            Скинути всі
                        </button>
                    </div>
                )}
            </div>

            <p className="text-sm text-gray-400 dark:text-gray-500 font-bold mb-6">
                Показано {filtered.length} з {totalReviews} відгуків
            </p>

            {/* Картки відгуків */}
            {isLoading ? (
                <div className="flex justify-center py-24">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800">
                    <div className="text-5xl mb-4">💬</div>
                    <p className="text-gray-400 dark:text-gray-500 text-lg font-bold">Відгуків не знайдено</p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Спробуйте змінити або скинути фільтри</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filtered.map((review) => {
                        const course = courses.find((c) => c.id === review.course);
                        const displayName = review.user.first_name
                            ? `${review.user.first_name} ${review.user.last_name || ''}`.trim()
                            : review.user.username;
                        const isOwn = review.user.id === user?.id;

                        return (
                            <div
                                key={review.id}
                                className={`bg-white dark:bg-slate-900 rounded-2xl p-6 border shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 ${
                                    isOwn
                                        ? 'border-blue-200 dark:border-blue-800'
                                        : 'border-gray-100 dark:border-slate-800'
                                }`}
                            >
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="w-11 h-11 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 font-black text-lg flex-shrink-0">
                                        {displayName.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2 flex-wrap">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-gray-900 dark:text-white">{displayName}</h3>
                                                {isOwn && (
                                                    <span className="text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                                                        Ви
                                                    </span>
                                                )}
                                            </div>
                                            <StarRow rating={review.rating} />
                                        </div>
                                        {course && (
                                            <Link
                                                to={`/courses/${course.slug}`}
                                                className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full mt-1 inline-block hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                                            >
                                                {course.title}
                                            </Link>
                                        )}
                                    </div>
                                </div>

                                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                    {review.comment}
                                </p>

                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
                                    {new Date(review.created_at).toLocaleDateString('uk-UA', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}

            <LeaveReviewModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                courses={courses}
                userId={user?.id}
                existingReviewCourseIds={myReviewCourseIds}
            />
        </section>
    );
}