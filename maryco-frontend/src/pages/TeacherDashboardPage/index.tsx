import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetTeacherDashboardQuery, useGetReviewsQuery } from '../../services/marycoApi';
import type { RootState } from '../../store';
// Імпортуємо створені типи
import type { IGroup, IStudentShort, ITeacherDashboard } from '../../types/teacher/ITeacher';
import {
    Calendar, BookOpen,
    ChevronDown, ChevronUp, GraduationCap, Star, LayoutDashboard
} from 'lucide-react';

const TeacherDashboardPage = () => {
    const { user } = useSelector((state: RootState) => state.auth);

    // Типізуємо результат запиту
    const { data: dashboard, isLoading, error } = useGetTeacherDashboardQuery() as {
        data: ITeacherDashboard | undefined,
        isLoading: boolean,
        error: any
    };

    const { data: reviews = [] } = useGetReviewsQuery(
        dashboard?.id ? { teacherId: dashboard.id } : undefined,
        { skip: !dashboard?.id }
    );

    const [openGroupId, setOpenGroupId] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<'groups' | 'reviews'>('groups');

    if (isLoading) return <div className="p-20 text-center animate-pulse font-bold">Завантаження даних...</div>;

    if (error || !dashboard) return (
        <div className="max-w-4xl mx-auto mt-20 p-10 bg-red-50 dark:bg-red-900/10 rounded-3xl text-center">
            <h2 className="text-2xl font-black text-red-600 mb-2">Профіль не знайдено</h2>
            <p className="text-gray-500">Ваш акаунт (ID: {user?.id}) не прив'язаний до профілю вчителя в системі.</p>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto px-4 py-12 min-h-screen">
            {/* Картка профілю */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-xl mb-12 flex flex-col md:flex-row items-center gap-8 border border-white dark:border-slate-800">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden shadow-lg border-4 border-gray-50 dark:border-slate-800 flex-shrink-0">
                    {dashboard.photo ? (
                        <img
                            src={dashboard.photo.startsWith('http') ? dashboard.photo : `http://127.0.0.1:8000${dashboard.photo}`}
                            alt={dashboard.full_name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-blue-100 dark:bg-slate-800 flex items-center justify-center text-5xl">👤</div>
                    )}
                </div>
                <div className="text-center md:text-left flex-1">
                    <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Викладач</span>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white mt-1 uppercase tracking-tighter">
                        {dashboard.full_name}
                    </h1>
                    <p className="text-blue-600 dark:text-blue-400 font-bold text-lg">{dashboard.subject}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sidebar: Графік */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-lg border border-white dark:border-slate-800 sticky top-24">
                        <h2 className="text-xl font-black mb-6 flex items-center gap-2 uppercase tracking-tight dark:text-white">
                            <Calendar size={20} className="text-blue-600" /> Мій Розклад
                        </h2>
                        <div className="space-y-4">
                            {dashboard.groups.map((group: IGroup) => (
                                <div key={group.id} className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border-l-4 border-blue-600">
                                    <p className="text-[11px] font-black text-blue-600 uppercase mb-1">{group.schedule}</p>
                                    <p className="font-bold text-gray-900 dark:text-white text-sm">{group.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Основна частина */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex gap-2 mb-4 bg-gray-100 dark:bg-slate-800 p-1 rounded-2xl w-fit">
                        <button
                            onClick={() => setActiveTab('groups')}
                            className={`px-6 py-2 rounded-xl font-bold text-sm flex items-center gap-2 ${activeTab === 'groups' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-gray-500'}`}
                        >
                            <LayoutDashboard size={16} /> Групи
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`px-6 py-2 rounded-xl font-bold text-sm flex items-center gap-2 ${activeTab === 'reviews' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-gray-500'}`}
                        >
                            <Star size={16} /> Відгуки ({reviews.length})
                        </button>
                    </div>

                    {activeTab === 'groups' ? (
                        dashboard.groups.map((group: IGroup) => (
                            <div key={group.id} className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-lg border border-white dark:border-slate-800 overflow-hidden">
                                <button
                                    onClick={() => setOpenGroupId(openGroupId === group.id ? null : group.id)}
                                    className="w-full p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800/50"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600">
                                            <BookOpen size={24} />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-black text-lg dark:text-white uppercase leading-none">{group.name}</h3>
                                            <p className="text-xs text-gray-500 font-bold mt-1">{group.course_title}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs font-black bg-green-100 dark:bg-green-900/30 text-green-700 px-3 py-1 rounded-lg">
                                            {group.students_count} УЧНІВ
                                        </span>
                                        {openGroupId === group.id ? <ChevronUp /> : <ChevronDown />}
                                    </div>
                                </button>

                                {openGroupId === group.id && (
                                    <div className="p-6 pt-0 border-t border-gray-50 dark:border-slate-800 bg-gray-50/30 dark:bg-slate-900/50">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                                            {group.students.map((student: IStudentShort) => (
                                                <div key={student.id} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
                                                    <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                                                        <GraduationCap size={16} className="text-blue-600" />
                                                    </div>
                                                    <span className="font-bold text-sm dark:text-gray-200">{student.full_name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((r: any) => (
                                <div key={r.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm">
                                    <div className="flex justify-between mb-2">
                                        <p className="font-black dark:text-white">{r.user.first_name} {r.user.last_name}</p>
                                        <div className="flex text-yellow-400 gap-1"><Star size={14} fill="currentColor" /> {r.rating}</div>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">"{r.comment}"</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboardPage;