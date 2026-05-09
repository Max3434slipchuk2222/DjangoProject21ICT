import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { BookOpen, Users, Star, Newspaper, ShieldCheck } from 'lucide-react';

export default function AdminPanelPage() {
    const { user } = useSelector((state: RootState) => state.auth);

    const cards = [
        { icon: BookOpen, label: 'Всього курсів', color: 'blue' },
        { icon: Users, label: 'Користувачів', color: 'indigo' },
        { icon: Star, label: 'Відгуків', color: 'yellow' },
        { icon: Newspaper, label: 'Новин', color: 'green' },
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="mb-10 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <ShieldCheck size={28} className="text-red-600 dark:text-red-400" />
                </div>
                <div>
                    <span className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-widest">Адмін-панель</span>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white">
                        {user?.first_name || user?.username}
                    </h1>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {cards.map(({ icon: Icon, label, color }) => (
                    <div key={label} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100 dark:border-slate-800 shadow-sm">
                        <div className={`w-10 h-10 rounded-xl bg-${color}-100 dark:bg-${color}-900/30 flex items-center justify-center mb-3`}>
                            <Icon size={20} className={`text-${color}-600 dark:text-${color}-400`} />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs font-bold">{label}</p>
                        <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">—</p>
                    </div>
                ))}
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/10 rounded-2xl p-8 border border-orange-100 dark:border-orange-900/30 text-center">
                <p className="text-gray-500 dark:text-gray-400">Повний CRUD-функціонал адмін-панелі буде реалізований наступним етапом</p>
            </div>
        </div>
    );
}