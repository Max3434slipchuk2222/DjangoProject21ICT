import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    BookOpen, Users, ChevronDown, ChevronUp,
    GraduationCap, Clock, Layers, Star,
} from 'lucide-react';
import { FaStar } from 'react-icons/fa6';
import { useGetTeachersQuery, useGetCoursesQuery } from '../../services/marycoApi';
import type { RootState } from '../../store';
import type { ICourse } from '../../types/course/ICourse';

// ─── Картка курсу ─────────────────────────────────────────────────────────────
function CourseCard({ course }: { course: ICourse }) {
    const [open, setOpen] = useState(false);
    const reviewCount = course.reviews?.length ?? 0;
    const avgRating = course.average_rating;

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
            {/* Верхня частина */}
            <div className="flex gap-4 p-5">
                {/* Обкладинка */}
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-slate-800">
                    {course.image ? (
                        <img
                            src={course.image.startsWith('http') ? course.image : `http://127.0.0.1:8000${course.image}`}
                            alt={course.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">📚</div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                        <h3 className="font-black text-gray-900 dark:text-white text-base leading-tight">
                            {course.title}
                        </h3>
                        {course.category && (
                            <span className="text-xs font-bold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-full flex-shrink-0">
                                {course.category.name}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-3 mt-2">
                        {course.age_range && (
                            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                <GraduationCap size={13} /> {course.age_range}
                            </span>
                        )}
                        {course.duration_info && (
                            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                <Clock size={13} /> {course.duration_info}
                            </span>
                        )}
                        {course.format_info && (
                            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                <Layers size={13} /> {course.format_info}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                        {avgRating ? (
                            <div className="flex items-center gap-1">
                                <FaStar size={13} className="text-yellow-400" />
                                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                                    {avgRating.toFixed(1)}
                                </span>
                                <span className="text-xs text-gray-400">({reviewCount} відгуків)</span>
                            </div>
                        ) : (
                            <span className="text-xs text-gray-400">Немає відгуків</span>
                        )}
                        <span className="font-black text-blue-600 dark:text-blue-400 text-sm ml-auto">
                            {course.price} грн/міс
                        </span>
                    </div>
                </div>
            </div>

            {/* Групи (розгортається) */}
            {course.groups && course.groups.length > 0 && (
                <>
                    <button
                        onClick={() => setOpen(!open)}
                        className="w-full flex items-center justify-between px-5 py-3 bg-gray-50 dark:bg-slate-800/60 border-t border-gray-100 dark:border-slate-700 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <span className="flex items-center gap-2">
                            <Users size={15} />
                            {course.groups.length} {course.groups.length === 1 ? 'група' : 'групи'}
                        </span>
                        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {open && (
                        <div className="px-5 py-4 border-t border-gray-100 dark:border-slate-700 flex flex-col gap-3">
                            {course.groups.map((group) => (
                                <div key={group.id} className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-bold text-gray-900 dark:text-white text-sm">
                                            {group.name}
                                        </span>
                                        <span className="text-xs text-gray-400 dark:text-gray-500 bg-white dark:bg-slate-700 px-2 py-0.5 rounded-lg">
                                            {group.schedule}
                                        </span>
                                    </div>
                                    {group.teachers && group.teachers.length > 0 && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Вчителі: {group.teachers.map((t) => t.full_name).join(', ')}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Перейти до курсу */}
            <div className="px-5 pb-5 pt-3">
                <Link
                    to={`/courses/${course.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                    Переглянути сторінку курсу →
                </Link>
            </div>
        </div>
    );
}

// ─── Головна сторінка ─────────────────────────────────────────────────────────
export default function TeacherDashboardPage() {
    const { user } = useSelector((state: RootState) => state.auth);
    const [activeTab, setActiveTab] = useState<'courses' | 'reviews'>('courses');

    const { data: teachers = [], isLoading: teachersLoading } = useGetTeachersQuery();
    const { data: allCourses = [], isLoading: coursesLoading } = useGetCoursesQuery();

    // Знаходимо профіль вчителя для поточного юзера
    const myTeacherProfile = teachers.find((t) => t.user === user?.id);

    // Курси де цей вчитель є викладачем
    const myCourses = myTeacherProfile
        ? allCourses.filter((c) => c.teachers?.some((t) => t.id === myTeacherProfile.id))
        : [];

    // Всі відгуки по моїх курсах
    const myReviews = myCourses.flatMap((c) =>
        (c.reviews ?? []).map((r) => ({ ...r, courseTitle: c.title, courseSlug: c.slug }))
    ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());


    const avgRating = myReviews.length > 0
        ? (myReviews.reduce((s, r) => s + r.rating, 0) / myReviews.length).toFixed(1)
        : null;

    const isLoading = teachersLoading || coursesLoading;

    return (
        <div className="max-w-6xl mx-auto px-4 py-12 min-h-screen">

            {/* Заголовок */}
            <div className="mb-10">
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                    Панель вчителя
                </span>
                <h1 className="text-4xl font-black text-gray-900 dark:text-white mt-1">
                    Вітаємо, {user?.first_name || user?.username}!
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Тут ви керуєте своїми курсами та переглядаєте відгуки
                </p>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-24">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600" />
                </div>
            ) : !myTeacherProfile ? (
                /* Профіль вчителя не прив'язаний */
                <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-2xl p-8 text-center">
                    <div className="text-4xl mb-3">⚠️</div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">
                        Профіль вчителя не знайдено
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Зверніться до адміністратора, щоб прив'язати ваш акаунт до профілю вчителя
                    </p>
                </div>
            ) : (
                <>
                    {/* Статистика */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                        {[
                            {
                                icon: BookOpen,
                                label: 'Моїх курсів',
                                value: myCourses.length,
                                color: 'blue',
                            },
                            {
                                icon: Star,
                                label: 'Середня оцінка',
                                value: avgRating ?? '—',
                                color: 'yellow',
                            },
                            {
                                icon: Users,
                                label: 'Відгуків отримано',
                                value: myReviews.length,
                                color: 'indigo',
                            },
                        ].map(({ icon: Icon, label, value, color }) => (
                            <div
                                key={label}
                                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm"
                            >
                                <div className={`w-11 h-11 rounded-xl bg-${color}-100 dark:bg-${color}-900/30 flex items-center justify-center mb-4`}>
                                    <Icon size={22} className={`text-${color}-600 dark:text-${color}-400`} />
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-bold">{label}</p>
                                <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">{value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Вкладки */}
                    <div className="flex gap-1 bg-gray-100 dark:bg-slate-800 p-1 rounded-xl w-fit mb-8">
                        {(['courses', 'reviews'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-5 py-2 rounded-lg font-bold text-sm transition-all ${
                                    activeTab === tab
                                        ? 'bg-white dark:bg-slate-900 text-gray-900 dark:text-white shadow-sm'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                }`}
                            >
                                {tab === 'courses' ? `Мої курси (${myCourses.length})` : `Відгуки (${myReviews.length})`}
                            </button>
                        ))}
                    </div>

                    {/* Вміст вкладок */}
                    {activeTab === 'courses' && (
                        myCourses.length === 0 ? (
                            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800">
                                <BookOpen size={48} className="text-gray-300 dark:text-slate-600 mx-auto mb-4" />
                                <p className="text-gray-500 dark:text-gray-400 font-bold">Вас ще не прикріплено до жодного курсу</p>
                                <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Зверніться до адміністратора</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {myCourses.map((course) => (
                                    <CourseCard key={course.id} course={course} />
                                ))}
                            </div>
                        )
                    )}

                    {activeTab === 'reviews' && (
                        myReviews.length === 0 ? (
                            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800">
                                <Star size={48} className="text-gray-300 dark:text-slate-600 mx-auto mb-4" />
                                <p className="text-gray-500 dark:text-gray-400 font-bold">Відгуків на ваші курси ще немає</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {myReviews.map((review) => {
                                    const displayName = review.user.first_name
                                        ? `${review.user.first_name} ${review.user.last_name || ''}`.trim()
                                        : review.user.username;

                                    return (
                                        <div
                                            key={review.id}
                                            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 font-black flex-shrink-0">
                                                    {displayName.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                                                        <span className="font-bold text-gray-900 dark:text-white">{displayName}</span>
                                                        <div className="flex gap-0.5">
                                                            {[1, 2, 3, 4, 5].map((i) => (
                                                                <FaStar
                                                                    key={i}
                                                                    size={13}
                                                                    className={i <= review.rating ? 'text-yellow-400' : 'text-gray-200 dark:text-slate-700'}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <Link
                                                        to={`/courses/${review.courseSlug}`}
                                                        className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full inline-block mb-2 hover:bg-blue-100 transition-colors"
                                                    >
                                                        {review.courseTitle}
                                                    </Link>
                                                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                                        {review.comment}
                                                    </p>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                                                        {new Date(review.created_at).toLocaleDateString('uk-UA', {
                                                            day: 'numeric', month: 'long', year: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )
                    )}
                </>
            )}
        </div>
    );
}