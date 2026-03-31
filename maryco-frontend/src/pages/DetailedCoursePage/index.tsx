import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetCourseByIdQuery } from "../../services/marycoApi";

const CheckIcon = () => (
    <div className="bg-blue-100 p-1 rounded-full mr-3 text-blue-700 flex-shrink-0">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
        </svg>
    </div>
);

const CourseDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { data: course, isLoading, error } = useGetCourseByIdQuery(Number(id));

    if (isLoading) return <div className="p-10 text-center dark:text-white font-bold">Завантаження...</div>;
    if (error || !course) return <div className="p-10 text-center text-red-500 font-bold">Курс не знайдено</div>;

    return (
        <div className="bg-[#F5F5F5] dark:bg-slate-950 min-h-screen text-gray-900 dark:text-white font-sans selection:bg-blue-100">
            <div className="container mx-auto px-4 py-8 max-w-6xl">

                <nav className="text-sm text-gray-400 mb-10 flex gap-2 items-center">
                    <Link to="/" className="hover:text-blue-600 transition">Головна</Link>
                    <span>•</span>
                    <Link to="/courses" className="hover:text-blue-600 transition">Курси</Link>
                    <span>•</span>
                    <span className="text-gray-800 dark:text-gray-300 font-medium">{course.title}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
                    <div className="order-2 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left">
                        <h1 className="text-4xl md:text-6xl font-black mb-8 leading-[1.1] uppercase tracking-tighter">
                            {course.title}
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-lg leading-relaxed">
                            {course.description}
                        </p>
                        <button className="px-14 py-5 bg-blue-700 hover:bg-blue-800 text-white font-extrabold rounded-2xl text-lg transition-all shadow-xl shadow-blue-700/25 active:scale-95">
                            Записатись на курс
                        </button>
                    </div>
                    <div className="order-1 lg:order-2 relative aspect-[3/3] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white dark:border-slate-900">
                        {course.image ? <img src={course.image} alt={course.title} className="w-full h-full object-cover object-top" /> : <div className="w-full h-full bg-slate-200 flex items-center justify-center text-8xl">📚</div>}
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-24 items-start">
                    <div className="lg:col-span-2 space-y-16">
                        <section>
                            <h2 className="text-3xl font-bold mb-8 uppercase tracking-tight">Як проходять заняття?</h2>
                            <p className="text-gray-700 dark:text-gray-300 leading-loose text-lg max-w-2xl font-light">
                                Кожне заняття розроблене з урахуванням вікових особливостей дитини.
                                Ми використовуємо найкращі світові методики для гармонійного розвитку малюка.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-xl font-black mb-8 uppercase tracking-widest text-blue-700 dark:text-blue-400">Дитина отримає:</h3>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-10">
                                {course.benefits?.map((benefit, idx) => (
                                    <li key={idx} className="flex items-start text-gray-800 dark:text-gray-200 font-medium">
                                        <CheckIcon /> {benefit}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {course.groups && course.groups.length > 0 && (
                            <section>
                                <h3 className="text-xl font-black mb-8 uppercase tracking-widest text-orange-500">Доступні групи:</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {course.groups.map((group) => (
                                        <div key={group.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border-l-4 border-orange-500 shadow-md">
                                            <h4 className="font-bold text-lg mb-2">{group.name}</h4>
                                            <p className="text-sm text-gray-500 mb-3 flex items-center">
                                                <span className="mr-2">🕒</span> {group.schedule}
                                            </p>
                                            <div className="text-xs text-blue-600 font-medium">
                                                Викладачі: {group.teachers.map(t => t.full_name).join(', ')}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-12 rounded-[2.5rem] shadow-2xl border border-white dark:border-slate-800 sticky top-10">
                        <h3 className="text-xs font-black mb-10 uppercase tracking-[0.2em] text-gray-400 text-center">Детальна інформація</h3>
                        <div className="space-y-6 text-[15px] mb-12">
                            <div className="flex justify-between border-b pb-3">
                                <span className="text-gray-500">Вік:</span>
                                <span className="font-bold">{course.age_range}</span>
                            </div>
                            <div className="flex justify-between border-b pb-3">
                                <span className="text-gray-500">Термін:</span>
                                <span className="font-bold">{course.duration_info}</span>
                            </div>
                            <div className="flex justify-between border-b pb-3">
                                <span className="text-gray-500">Формат:</span>
                                <span className="font-bold">{course.format_info}</span>
                            </div>
                        </div>
                        <div className="text-center mb-10">
                            <span className="text-5xl font-black text-blue-700 tracking-tighter">
                                {Math.floor(Number(course.price))} <small className="text-lg font-bold">грн/міс</small>
                            </span>
                        </div>
                        <button className="w-full py-4 border-2 border-blue-700 text-blue-700 dark:text-blue-400 font-black rounded-2xl hover:bg-blue-700 hover:text-white transition-all shadow-lg shadow-blue-700/10">
                            Спробувати безкоштовно
                        </button>
                    </div>
                </div>

                <div className="mb-32">
                    <h2 className="text-4xl font-black mb-16 text-center uppercase tracking-tight">Програма навчання</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {course.program_steps?.map((step, index) => (
                            <div key={index} className="bg-white dark:bg-slate-900 p-10 rounded-[2rem] shadow-xl border border-transparent hover:border-blue-100 transition-all group">
                                <span className="text-6xl font-black text-gray-100 dark:text-slate-800 mb-6 block group-hover:text-blue-50 transition-colors">0{index + 1}</span>
                                <h4 className="text-xl font-black mb-4 uppercase">{step.title}</h4>
                                <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 md:p-20 shadow-2xl">
                    <h2 className="text-3xl font-black mb-16 text-center uppercase tracking-tight">Наші викладачі</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                        {course.teachers?.map((teacher) => (
                            <div key={teacher.id} className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                                <div className="w-48 h-48 rounded-[2rem] overflow-hidden flex-shrink-0 shadow-lg border-4 border-[#F5F5F5] dark:border-slate-800">
                                    {teacher.photo ? <img src={teacher.photo} alt={teacher.full_name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-200 flex items-center justify-center text-4xl">👤</div>}
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-black uppercase">{teacher.full_name}</h3>
                                    <p className="text-blue-600 font-bold text-sm tracking-widest uppercase">{teacher.experience}</p>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm italic">"{teacher.bio}"</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CourseDetailPage;