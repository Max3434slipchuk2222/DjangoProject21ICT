import { useParams, NavLink } from 'react-router-dom';
import { useGetCoursesQuery, useGetCategoriesQuery } from '../../services/marycoApi';

export default function CoursesPage() {
    const { categoryId } = useParams();
    const { data: categories = [] } = useGetCategoriesQuery();
    const { data: allCourses = [], isLoading, error } = useGetCoursesQuery();

    const filteredCourses = categoryId
        ? allCourses.filter(course => course.category?.id === Number(categoryId))
        : allCourses;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <section className="max-w-6xl mx-auto px-4 py-16 min-h-screen">
            <header className="text-center mb-12">
                <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-4">
                    Наші курси
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                    Оберіть напрямок, який вас цікавить
                </p>
            </header>

            <div className="flex flex-wrap gap-3 justify-center mb-12">
                <NavLink
                    to="/courses"
                    end
                    className={({ isActive }) =>
                        `px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm ${
                            isActive
                                ? 'bg-blue-600 text-white shadow-blue-200'
                                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50'
                        }`
                    }
                >
                    Всі курси
                </NavLink>

                {categories.map(cat => (
                    <NavLink
                        key={cat.id}
                        to={`/courses/category/${cat.id}`}
                        className={({ isActive }) =>
                            `px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm ${
                                isActive
                                    ? 'bg-blue-600 text-white shadow-blue-200'
                                    : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50'
                            }`
                        }
                    >
                        {cat.name}
                    </NavLink>
                ))}
            </div>

            {error && <p className="text-red-500 text-center mb-8">Помилка завантаження даних</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.length > 0 ? (
                    filteredCourses.map(course => (
                        <div
                            key={course.id}
                            className="group bg-white/80 dark:bg-slate-900/80 rounded-3xl overflow-hidden shadow-xl transform transition duration-500 hover:scale-[1.03] hover:shadow-2xl border border-slate-200/50 dark:border-slate-700/50 flex flex-col"
                        >
                            <div className="relative h-52 overflow-hidden">
                                {course.image ? (
                                    <img
                                        src={course.image}
                                        alt={course.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 object-top"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-6xl">
                                        📚
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60"></div>
                                <div className="absolute top-4 left-4">
                                    <span className="bg-white/90 backdrop-blur-sm text-blue-600 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-wider shadow-sm">
                                        {course.category?.name}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-1 gap-3">
                                <h3 className="font-black text-gray-900 dark:text-white text-xl text-center group-hover:text-blue-600 transition-colors">
                                    {course.title}
                                </h3>

                                <p className="text-sm text-gray-500 dark:text-gray-400 flex-1 leading-relaxed text-center line-clamp-3">
                                    {course.description.replace(/<[^>]*>?/gm, '')}
                                </p>

                                <div className="flex items-center justify-between pt-5 border-t border-gray-100 dark:border-slate-800 mt-4">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-400 uppercase font-bold">Місяць навчання</span>
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
                    <div className="col-span-full py-20 text-center">
                        <div className="text-5xl mb-4">🔍</div>
                        <p className="text-gray-400 font-medium">Курси в цій категорії незабаром з'являться</p>
                    </div>
                )}
            </div>
        </section>
    );
}