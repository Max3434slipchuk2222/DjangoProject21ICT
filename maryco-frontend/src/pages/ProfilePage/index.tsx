// src/pages/ProfilePage/index.tsx
import { useSelector, useDispatch } from 'react-redux';
import type {RootState} from '../../store';
import { logout } from '../../store/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, BookOpen, LogOut, Settings, GraduationCap } from 'lucide-react';

export default function ProfilePage() {
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const displayName = user?.first_name && user?.last_name
        ? `${user.first_name} ${user.last_name}`
        : user?.username;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* ВЕРХНЯ КАРТКА ПРОФІЛЮ */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-800">
                    {/* Банер */}
                    <div className="h-32 sm:h-48 bg-gradient-to-r from-blue-600 to-blue-400 relative">
                        {/* Аватарка, яка "виглядає" з банера */}
                        <div className="absolute -bottom-12 left-8 sm:left-12">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-white dark:bg-slate-800 border-4 border-white dark:border-slate-900 flex items-center justify-center text-4xl sm:text-5xl font-black text-blue-600 shadow-lg">
                                {user?.first_name ? user.first_name.charAt(0).toUpperCase() : user?.username?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>

                    <div className="pt-16 pb-10 px-8 sm:px-12">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                            <div>
                                <h1 className="text-3xl font-black text-gray-900 dark:text-white">
                                    {displayName}
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400 flex items-center mt-2 font-medium">
                                    <Mail size={18} className="mr-2" /> {user?.email}
                                </p>
                            </div>
                            <div className="flex gap-3 w-full sm:w-auto">
                                <button className="flex-1 sm:flex-none px-6 py-3 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center">
                                    <Settings size={18} className="mr-2" /> Налаштування
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 transition-all"
                                    title="Вийти з акаунту"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* СЕКЦІЯ КУРСІВ */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 sm:p-12 border border-gray-100 dark:border-slate-800">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center">
                        <GraduationCap className="mr-3 text-blue-600" size={28} />
                        Моє навчання
                    </h2>

                    <div className="grid grid-cols-1 gap-6">
                        {/* Заглушка, оскільки ми ще не зробили ендпоінт для "Моїх курсів" на бекенді */}
                        <div className="border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-3xl p-10 flex flex-col items-center text-center transition-colors">
                            <BookOpen size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                Ви ще не записані на жоден курс
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                                Оберіть напрямок, який вам до душі, та почніть навчання в Maryco Club вже сьогодні!
                            </p>
                            <Link
                                to="/courses"
                                className="px-8 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md transition-all"
                            >
                                Переглянути всі курси
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}