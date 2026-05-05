import React, {useState} from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetCourseBySlugQuery } from "../../services/marycoApi";
import CourseReviews from '../../components/CourseReviews';
import EnrollModal from "../../components/EnrollModal.tsx";

const CheckIcon = () => (
    <div className="bg-blue-100 dark:bg-blue-900/30 p-1 rounded-full mr-3 text-blue-700 dark:text-blue-400 flex-shrink-0 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
        </svg>
    </div>
);

const CourseDetailPage: React.FC = () => {
    const { slug } = useParams();
    const { data: course, isLoading, error } = useGetCourseBySlugQuery(slug!);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (isLoading) return <div className="p-10 text-center text-gray-900 dark:text-white font-bold transition-colors">Завантаження...</div>;
    if (error || !course) return <div className="p-10 text-center text-red-500 dark:text-red-400 font-bold transition-colors">Курс не знайдено</div>;

    return (
        <div className="bg-[#F5F5F5] dark:bg-slate-950 min-h-screen text-gray-900 dark:text-white font-sans selection:bg-blue-100 dark:selection:bg-blue-900/50 transition-colors duration-300">
            <div className="container mx-auto px-4 py-8 max-w-6xl">

                <nav className="text-sm text-gray-400 dark:text-gray-500 mb-10 flex gap-2 items-center transition-colors">
                    <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Головна</Link>
                    <span>•</span>
                    <Link to="/courses" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Курси</Link>
                    <span>•</span>
                    <span className="text-gray-800 dark:text-gray-300 font-medium transition-colors">{course.title}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
                    <div className="order-2 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left">
                        <h1 className="text-4xl md:text-6xl font-black mb-8 leading-[1.1] uppercase tracking-tighter transition-colors">
                            {course.title}
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-lg leading-relaxed transition-colors">
                            {course.description}
                        </p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-8 rounded-2xl transition-all shadow-lg shadow-blue-500/30 dark:shadow-none text-lg hover:-translate-y-1"
                        >
                            Записатись на курс
                        </button>
                    </div>
                    <div className="order-1 lg:order-2 relative aspect-[3/3] rounded-[2.5rem] overflow-hidden shadow-2xl dark:shadow-none border-8 border-white dark:border-slate-900 transition-colors">
                        {course.image ? <img src={course.image.startsWith('http') ? course.image : `http://127.0.0.1:8000${course.image}`} alt={course.title} className="w-full h-full object-cover object-top" /> : <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-8xl transition-colors">📚</div>}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-24 items-start">
                    <div className="lg:col-span-2 space-y-16">
                        <section>
                            <h2 className="text-3xl font-bold mb-8 uppercase tracking-tight transition-colors">Як проходять заняття?</h2>
                            <p className="text-gray-700 dark:text-gray-300 leading-loose text-lg max-w-2xl font-light transition-colors">
                                Кожне заняття розроблене з урахуванням вікових особливостей дитини.
                                Ми використовуємо найкращі світові методики для гармонійного розвитку малюка.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-xl font-black mb-8 uppercase tracking-widest text-blue-700 dark:text-blue-400 transition-colors">Дитина отримає:</h3>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-10">
                                {course.benefits?.map((benefit, idx) => (
                                    <li key={idx} className="flex items-start text-gray-800 dark:text-gray-200 font-medium transition-colors">
                                        <CheckIcon /> {benefit}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {course.groups && course.groups.length > 0 && (
                            <section>
                                <h3 className="text-xl font-black mb-8 uppercase tracking-widest text-orange-500 dark:text-orange-400 transition-colors">Доступні групи:</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {course.groups.map((group) => (
                                        <div key={group.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border-l-4 border-orange-500 shadow-md dark:shadow-none transition-colors">
                                            <h4 className="font-bold text-lg mb-2 transition-colors">{group.name}</h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 flex items-center transition-colors">
                                                <span className="mr-2">🕒</span> {group.schedule}
                                            </p>
                                            <div className="text-xs text-blue-600 dark:text-blue-400 font-medium transition-colors">
                                                Викладачі: {group.teachers.map(t => t.full_name).join(', ')}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-12 rounded-[2.5rem] shadow-2xl dark:shadow-none border border-white dark:border-slate-800 sticky top-24 transition-colors">
                        <h3 className="text-xs font-black mb-10 uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 text-center transition-colors">Детальна інформація</h3>
                        <div className="space-y-6 text-[15px] mb-12">
                            <div className="flex justify-between border-b border-gray-100 dark:border-slate-800 pb-3 transition-colors">
                                <span className="text-gray-500 dark:text-gray-400 transition-colors">Вік:</span>
                                <span className="font-bold transition-colors">{course.age_range}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-100 dark:border-slate-800 pb-3 transition-colors">
                                <span className="text-gray-500 dark:text-gray-400 transition-colors">Термін:</span>
                                <span className="font-bold transition-colors">{course.duration_info}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-100 dark:border-slate-800 pb-3 transition-colors">
                                <span className="text-gray-500 dark:text-gray-400 transition-colors">Формат:</span>
                                <span className="font-bold transition-colors">{course.format_info}</span>
                            </div>
                        </div>
                        <div className="text-center mb-10">
                            <span className="text-5xl font-black text-blue-700 dark:text-blue-400 tracking-tighter transition-colors">
                                {Math.floor(Number(course.price))} <small className="text-lg font-bold">грн/міс</small>
                            </span>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-900 dark:text-white font-bold py-4 px-8 rounded-2xl w-full transition-all shadow-xl dark:shadow-none shadow-gray-200 border border-gray-100 dark:border-slate-700 hover:-translate-y-1"
                        >
                            Спробувати безкоштовно
                        </button>
                    </div>
                </div>

                <div className="mb-32">
                    <h2 className="text-4xl font-black mb-16 text-center uppercase tracking-tight transition-colors">Програма навчання</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {course.program_steps?.map((step, index) => (
                            <div key={index} className="bg-white dark:bg-slate-900 p-10 rounded-[2rem] shadow-xl dark:shadow-none border border-transparent hover:border-blue-100 dark:hover:border-slate-700 transition-all group">
                                <span className="text-6xl font-black text-gray-100 dark:text-slate-800 mb-6 block group-hover:text-blue-50 dark:group-hover:text-slate-700 transition-colors">0{index + 1}</span>
                                <h4 className="text-xl font-black mb-4 uppercase transition-colors">{step.title}</h4>
                                <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm transition-colors">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 md:p-20 shadow-2xl dark:shadow-none transition-colors">
                    <h2 className="text-3xl font-black mb-16 text-center uppercase tracking-tight transition-colors">Наші викладачі</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                        {course.teachers?.map((teacher) => (
                            <div key={teacher.id} className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                                <div className="w-48 h-48 rounded-[2rem] overflow-hidden flex-shrink-0 shadow-lg dark:shadow-none border-4 border-[#F5F5F5] dark:border-slate-800 transition-colors">
                                    {teacher.photo ? <img src={teacher.photo.startsWith('http') ? teacher.photo : `http://127.0.0.1:8000${teacher.photo}`} alt={teacher.full_name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-4xl transition-colors">👤</div>}
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-black uppercase transition-colors">{teacher.full_name}</h3>
                                    <p className="text-blue-600 dark:text-blue-400 font-bold text-sm tracking-widest uppercase transition-colors">{teacher.experience}</p>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm italic transition-colors">"{teacher.bio}"</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 pb-20 mt-20">
                    <CourseReviews
                        courseId={course.id}
                        reviews={course.reviews}
                        averageRating={course.average_rating}
                    />
                </div>

                <EnrollModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    initialCourseId={course.id}
                    courseTitle={course.title}
                />

            </div>
        </div>
    );
};

export default CourseDetailPage;