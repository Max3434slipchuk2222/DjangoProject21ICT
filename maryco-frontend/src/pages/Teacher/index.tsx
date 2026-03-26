import { useGetTeachersQuery } from '../../services/marycoApi';

export default function TeachersPage() {
    const { data: teachers = [], isLoading, error } = useGetTeachersQuery();

    // Функція для генерації ініціалів, якщо немає фото
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 bg-blue-200 rounded-full mb-4"></div>
                    <span className="text-gray-400 font-bold">Завантаження...</span>
                </div>
            </div>
        );
    }

    return (
        <section className="max-w-6xl mx-auto px-4 py-16 min-h-screen">
            <header className="mb-16 text-center">
                <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-4">
                    Наші викладачі
                </h1>
                <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
            </header>

            {error && (
                <p className="text-red-500 text-center mb-10">
                    Не вдалося завантажити список викладачів
                </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {teachers.length > 0 ? (
                    teachers.map((teacher) => (
                        <div
                            key={teacher.id}
                            className="group bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-3xl p-8 text-center shadow-xl border border-white/50 dark:border-slate-800 transform transition-all duration-500 hover:scale-105 hover:shadow-blue-500/10"
                        >
                            <div className="relative mb-6 mx-auto w-24 h-24">
                                <div className="absolute inset-0 bg-blue-600 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-300"></div>
                                <div className="absolute inset-0 bg-gray-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center border-2 border-white dark:border-slate-700 z-10">
                                    <span className="text-2xl font-black text-blue-600">
                                        {getInitials(teacher.full_name)}
                                    </span>
                                </div>
                            </div>

                            <h3 className="font-black text-gray-900 dark:text-white text-lg mb-2 group-hover:text-blue-600 transition-colors">
                                {teacher.full_name}
                            </h3>

                            <div className="relative">
                                <span className="inline-block bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                                    {teacher.subject}
                                </span>
                            </div>

                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center bg-gray-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-slate-800">
                        <p className="text-gray-400 font-bold">Викладачі незабаром з'являться</p>
                    </div>
                )}
            </div>
        </section>
    );
}