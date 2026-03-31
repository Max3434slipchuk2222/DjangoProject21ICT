import { NavLink } from 'react-router-dom';
import { useGetCoursesQuery } from '../../services/marycoApi';

export default function HomePage() {
    const { data: courses = [], isLoading, error } = useGetCoursesQuery();

    const popularCourses = courses.slice(0, 3);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                <span className="ml-3 font-bold text-gray-600">Завантаження курсів...</span>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-transparent">
            <h1 className="text-center text-blue-500 mt-16 text-2xl font-black uppercase tracking-widest">
                Головна
            </h1>

            <section className="py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-4xl font-black text-center text-gray-900 dark:text-white mb-12">
                        Наші популярні курси
                    </h2>

                    {error && (
                        <p className="text-red-500 text-center mb-10">
                            Помилка при завантаженні: {(error as any)?.data || 'Невідома помилка'}
                        </p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {popularCourses.length > 0 ? (
                            popularCourses.map((course) => (
                                <div
                                    key={course.id}
                                    className="bg-white/80 dark:bg-slate-900/80 rounded-2xl shadow-xl overflow-hidden transform transition duration-500 hover:scale-105 hover:shadow-2xl border border-slate-200/50 dark:border-slate-700/50 flex flex-col"
                                >
                                    <div className="relative h-48 w-full overflow-hidden">
                                        {course.image ? (
                                            <img
                                                src={course.image}
                                                alt={course.title}
                                                className="w-full h-full object-cover object-top"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center text-5xl">
                                                📚
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                                        <div className="absolute bottom-4 left-4">
                                            <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                                                {course.category?.name || 'Курс'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6 flex flex-col flex-1">
                                        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3 leading-tight">
                                            {course.title}
                                        </h3>

                                        <p className="text-sm text-gray-500 dark:text-gray-400 flex-1 leading-relaxed line-clamp-3">
                                            {course.description.replace(/<[^>]*>?/gm, '')}
                                        </p>

                                        <div className="flex items-center justify-between pt-5 border-t border-gray-100 dark:border-slate-800 mt-5">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-gray-400 uppercase font-bold">Вартість</span>
                                                <span className="font-black text-blue-600 dark:text-blue-400 text-lg">
                                                    {course.price} грн
                                                </span>
                                            </div>

                                            <NavLink
                                                to={`/courses/${course.id}`}
                                                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold text-sm px-4 py-2 rounded-xl transition-all duration-300 shadow-sm hover:shadow-blue-200"
                                            >
                                                Детальніше →
                                            </NavLink>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            !isLoading && <p className="text-center text-gray-400 col-span-3 py-10">Курси незабаром з'являться</p>
                        )}
                    </div>

                    <div className="text-center mt-16">
                        <NavLink
                            to="/courses"
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-black px-10 py-4 rounded-2xl transition-all transform hover:scale-110 shadow-lg hover:shadow-blue-500/20"
                        >
                            Переглянути всі курси
                        </NavLink>
                    </div>
                </div>
            </section>
        </main>
    );
}