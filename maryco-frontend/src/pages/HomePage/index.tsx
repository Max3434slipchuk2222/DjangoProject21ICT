import { NavLink } from 'react-router-dom';
import {
    useGetCoursesQuery,
    useGetNewsQuery,
    useGetPromotionsQuery,
    useGetTeachersQuery, useSubmitTrialLessonMutation
} from '../../services/marycoApi';
import {useState} from "react";
import { PatternFormat } from 'react-number-format';
import { Users, BookOpen, Monitor, Star, User, Zap, Globe } from 'lucide-react'
import EnrollModal from "../../components/EnrollModal.tsx";

const features = [
    { icon: <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />, text: 'Групові заняття' },
    { icon: <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />, text: 'Індивідуальні заняття' },
    { icon: <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />, text: 'Авторські програми' },
    { icon: <Monitor className="w-6 h-6 text-blue-600 dark:text-blue-400" />, text: 'Сучасне обладнання' },
    { icon: <Star className="w-6 h-6 text-blue-600 dark:text-blue-400" />, text: 'Індивідуальний підхід' },
]

const advantages = [
    {
        icon: <Users className="w-12 h-12 text-blue-600 dark:text-blue-400" />,
        title: 'Малі групи',
        text: 'У класі навчається до 10 дітей. Вчитель приділяє увагу кожному учню.',
    },
    {
        icon: <Zap className="w-12 h-12 text-blue-600 dark:text-blue-400" />,
        title: 'Покращення швидкочитання',
        text: 'Вчимо техніку та способи скорочитання з юного віку.',
    },
    {
        icon: <Globe className="w-12 h-12 text-blue-600 dark:text-blue-400" />,
        title: 'Англійська мова',
        text: 'Щоденні уроки англійської з носіями мови.',
    },
]

export default function HomePage() {
    const { data: courses = [], isLoading: coursesLoading } = useGetCoursesQuery()
    const { data: teachers = [], isLoading: teachersLoading } = useGetTeachersQuery()
    const { data: news = [] } = useGetNewsQuery()
    const { data: promotions = [] } = useGetPromotionsQuery()

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCourseForModal] = useState<number | null>(null);

    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [age, setAge] = useState('');
    const [courseId, setCourseId] = useState<number | null>(null);

    const [submitTrial, { isLoading: isSubmitting, isSuccess }] = useSubmitTrialLessonMutation();

    const handleStaticSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (fullName.trim() && phone.length > 10) {
            await submitTrial({
                full_name: fullName,
                phone,
                child_age: age,
                course: courseId
            });
            setFullName('');
            setPhone('');
            setAge('');
            setCourseId(null);
        }
    };
    const popularCourses = courses.slice(0, 3)
    const [teacherIndex, setTeacherIndex] = useState(0)
    const visibleTeachers = 4

    const prevTeacher = () => setTeacherIndex(i => Math.max(0, i - 1))
    const nextTeacher = () => setTeacherIndex(i => Math.min(teachers.length - visibleTeachers, i + 1))

    return (
        <main className="min-h-screen font-nunito transition-colors">

            <section className="bg-white dark:bg-gray-900 transition-colors">
                <div className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-8 transition-colors">
                            Розкрий потенціал<br />
                            <span className="text-blue-600 dark:text-blue-500">своєї дитини</span>
                        </h1>
                        <ul className="flex flex-col gap-4 mb-10">
                            {features.map((f, i) => (
                                <li key={i} className="flex items-center gap-3 font-semibold text-gray-700 dark:text-gray-300 text-lg transition-colors">
                                    <span>{f.icon}</span> {f.text}
                                </li>
                            ))}
                        </ul>
                        <NavLink
                            to="/courses"
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-black px-10 py-4 rounded-xl text-lg transition-all shadow-lg shadow-blue-200 dark:shadow-none hover:scale-105"
                        >
                            Обрати курс
                        </NavLink>
                    </div>
                    <div className="relative">
                        <img
                            src="/public/HomePage.jpg"
                            alt="Діти навчаються"
                            className="w-full h-[480px] object-cover rounded-3xl shadow-2xl dark:shadow-none"
                        />
                    </div>
                </div>
            </section>

            <section className="py-20 bg-gray-50 dark:bg-gray-950 transition-colors">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-4xl font-black text-center text-gray-900 dark:text-white mb-14 uppercase tracking-tight transition-colors">
                        Чому обирають Maryco Club
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {advantages.map((adv, i) => (
                            <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-8 text-center shadow-sm dark:shadow-none hover:shadow-lg dark:hover:bg-gray-800 hover:-translate-y-1 transition-all border border-transparent dark:border-gray-800">
                                <div className="mb-4 flex justify-center">{adv.icon}</div>
                                <h3 className="font-black text-gray-900 dark:text-white text-lg mb-3 uppercase transition-colors">{adv.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm transition-colors">{adv.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 bg-white dark:bg-gray-900 transition-colors">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-4xl font-black text-center text-gray-900 dark:text-white mb-14 uppercase tracking-tight transition-colors">
                        Наші популярні курси
                    </h2>
                    {coursesLoading ? (
                        <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {popularCourses.map(course => (
                                <div key={course.id} className="group bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-none hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col border border-transparent dark:border-gray-700">
                                    <div className="relative h-52 overflow-hidden">
                                        {course.image
                                            ? <img src={course.image.startsWith('http') ? course.image : `http://127.0.0.1:8000${course.image}`} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            : <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-6xl">📚</div>
                                        }
                                    </div>
                                    <div className="p-6 flex flex-col flex-1">
                                        <h3 className="font-black text-gray-900 dark:text-white text-lg mb-1 uppercase transition-colors">{course.title}</h3>
                                        {course.age_range && (
                                            <p className="text-sm text-gray-400 dark:text-gray-400 mb-3 transition-colors">Для дітей {course.age_range}</p>
                                        )}
                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 transition-colors">
                                            <span className="font-black text-blue-600 dark:text-blue-400 text-lg transition-colors">{course.price} грн / міс</span>
                                            <NavLink
                                                to={`/courses/${course.id}`}
                                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-4 py-2 rounded-lg transition-colors"
                                            >
                                                Детальніше →
                                            </NavLink>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="text-center mt-12">
                        <NavLink
                            to="/courses"
                            className="inline-block border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-500 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white font-black px-10 py-4 rounded-xl transition-all"
                        >
                            Всі курси
                        </NavLink>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-gray-50 dark:bg-gray-950 transition-colors">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-4xl font-black text-center text-gray-900 dark:text-white mb-14 uppercase tracking-tight transition-colors">
                        Наші викладачі
                    </h2>
                    {teachersLoading ? (
                        <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <div className="relative flex items-center gap-4">
                            <button
                                onClick={prevTeacher}
                                disabled={teacherIndex === 0}
                                className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-all disabled:opacity-30 flex-shrink-0"
                            >
                                ←
                            </button>
                            <div className="flex gap-6 overflow-hidden flex-1">
                                {teachers.slice(teacherIndex, teacherIndex + visibleTeachers).map(teacher => (
                                    <div key={teacher.id} className="flex-1 min-w-0 bg-white dark:bg-gray-900 rounded-2xl p-6 text-center shadow-sm dark:shadow-none hover:shadow-lg transition-all border border-transparent dark:border-gray-800">
                                        <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-4 border-blue-50 dark:border-gray-800">
                                            {teacher.photo
                                                ? <img src={teacher.photo.startsWith('http') ? teacher.photo : `http://127.0.0.1:8000${teacher.photo}`} alt={teacher.full_name} className="w-full h-full object-cover" />
                                                : <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-black">
                                                    {teacher.full_name.slice(0, 1)}
                                                </div>
                                            }
                                        </div>
                                        <h3 className="font-black text-gray-900 dark:text-white text-sm mb-1 transition-colors">{teacher.full_name}</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">{teacher.subject}</p>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={nextTeacher}
                                disabled={teacherIndex >= teachers.length - visibleTeachers}
                                className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-all disabled:opacity-30 flex-shrink-0"
                            >
                                →
                            </button>
                        </div>
                    )}
                    <div className="text-center mt-12">
                        <NavLink
                            to="/teachers"
                            className="inline-block border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-500 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white font-black px-10 py-4 rounded-xl transition-all"
                        >
                            Всі викладачі
                        </NavLink>
                    </div>
                </div>
            </section>

            {news.length > 0 && (
                <section className="py-20 bg-white dark:bg-gray-900 transition-colors">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="text-center mb-14">
                            <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight transition-colors">
                                Новини школи
                            </h2>
                            <div className="w-16 h-1.5 bg-blue-600 dark:bg-blue-500 mx-auto mt-4 rounded-full"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {news.slice(0, 1).map(item => (
                                <div key={item.id} className="md:col-span-2 group relative rounded-3xl overflow-hidden shadow-xl cursor-pointer h-80">
                                    {item.image
                                        ? <img src={item.image.startsWith('http') ? item.image : `http://127.0.0.1:8000${item.image}`} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        : <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-8xl">📰</div>
                                    }
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-8">
                            <span className="inline-block bg-blue-600 dark:bg-blue-500 text-white text-xs font-black px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
                                {new Date(item.created_at).toLocaleDateString('uk-UA')}
                            </span>
                                        <h3 className="font-black text-white text-2xl leading-tight">{item.title}</h3>
                                        <p className="text-gray-300 text-sm mt-2 line-clamp-2">{item.content}</p>
                                    </div>
                                </div>
                            ))}
                            <div className="flex flex-col gap-4">
                                {news.slice(1, 3).map(item => (
                                    <div key={item.id} className="group relative rounded-2xl overflow-hidden shadow-lg cursor-pointer flex-1 min-h-36">
                                        {item.image
                                            ? <img src={item.image.startsWith('http') ? item.image : `http://127.0.0.1:8000${item.image}`} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                            : <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-5xl min-h-36">📰</div>
                                        }
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                                        <div className="absolute bottom-0 left-0 right-0 p-5">
                                <span className="text-gray-300 text-xs font-bold">
                                    {new Date(item.created_at).toLocaleDateString('uk-UA')}
                                </span>
                                            <h3 className="font-black text-white text-sm leading-tight mt-1">{item.title}</h3>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {promotions.length > 0 && (
                <section className="py-20 bg-gray-50 dark:bg-gray-950 transition-colors">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="text-center mb-14">
                            <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight transition-colors">
                                Акції та пропозиції
                            </h2>
                            <div className="w-16 h-1.5 bg-blue-600 dark:bg-blue-500 mx-auto mt-4 rounded-full"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {promotions.slice(0, 3).map((promo, index) => (
                                <div
                                    key={promo.id}
                                    className="group relative flex flex-col bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-lg dark:shadow-none hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-transparent dark:border-gray-800"
                                >
                                    <div className="absolute top-4 right-4 z-10">
                                        <div className="bg-yellow-400 text-gray-900 font-black text-lg px-4 py-2 rounded-2xl shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
                                            -{promo.discount}
                                        </div>
                                    </div>

                                    <div className="h-52 shrink-0 overflow-hidden">
                                        {promo.image
                                            ? <img src={promo.image.startsWith('http') ? promo.image : `http://127.0.0.1:8000${promo.image}`} alt={promo.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            : <div className={`w-full h-full flex items-center justify-center text-6xl ${
                                                index === 0 ? 'bg-gradient-to-br from-blue-400 to-blue-600' :
                                                    index === 1 ? 'bg-gradient-to-br from-indigo-400 to-purple-600' :
                                                        'bg-gradient-to-br from-blue-500 to-cyan-600'
                                            }`}>🎁</div>
                                        }
                                    </div>

                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="font-black text-gray-900 dark:text-white text-lg mb-2 transition-colors">{promo.title}</h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4 transition-colors">{promo.description}</p>

                                        <div className="mt-auto">
                                            {promo.valid_until && (
                                                <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 mb-4 transition-colors">
                                                    <span>🕒</span>
                                                    <span>Діє до: <strong>{new Date(promo.valid_until).toLocaleDateString('uk-UA')}</strong></span>
                                                </div>
                                            )}

                                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3 rounded-xl transition-colors text-sm tracking-wide">
                                                Дізнатись більше
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <section className="py-24 bg-gray-900 dark:bg-gray-950 transition-colors" id="signup">
                <div className="max-w-2xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-black text-white mb-3">
                            Запишіться на безкоштовне пробне заняття
                        </h2>
                        <p className="text-gray-400 font-semibold">
                            Залиште контакти — ми зателефонуємо та підберемо зручний час
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-[40px] p-10 shadow-2xl dark:shadow-none border border-transparent dark:border-gray-800 transition-colors">
                        {isSuccess ? (
                            <div className="py-12 text-center">
                                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-500 dark:text-green-400 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">✓</div>
                                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2 transition-colors">Заявку прийнято!</h3>
                                <p className="text-gray-500 dark:text-gray-400 font-bold transition-colors">Менеджер незабаром зателефонує вам</p>
                            </div>
                        ) : (
                            <form onSubmit={handleStaticSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <input
                                        type="text" required value={fullName} onChange={e => setFullName(e.target.value)}
                                        placeholder="Ваше ім'я" className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-50 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-2xl outline-none focus:border-blue-500 dark:focus:border-blue-500 font-bold transition-all"
                                    />
                                    <PatternFormat
                                        format="+380 (##) ###-##-##" allowEmptyFormatting mask="_" required
                                        value={phone} onValueChange={v => setPhone(v.formattedValue)}
                                        className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-50 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-2xl outline-none focus:border-blue-500 dark:focus:border-blue-500 font-bold transition-all"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <input
                                        type="text" value={age} onChange={e => setAge(e.target.value)}
                                        placeholder="Вік дитини" className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-50 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-2xl outline-none focus:border-blue-500 dark:focus:border-blue-500 font-bold transition-all"
                                    />
                                    <select
                                        value={courseId || ''} onChange={e => setCourseId(e.target.value ? Number(e.target.value) : null)}
                                        className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-50 dark:border-gray-700 text-gray-900 dark:text-white rounded-2xl outline-none focus:border-blue-500 dark:focus:border-blue-500 font-bold transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="" className="text-gray-400">Оберіть курс</option>
                                        {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                                    </select>
                                </div>
                                <button
                                    type="submit" disabled={isSubmitting}
                                    className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl tracking-widest transition-all shadow-lg shadow-blue-200 dark:shadow-none"
                                >
                                    {isSubmitting ? 'ОБРОБКА...' : 'ВІДПРАВИТИ ЗАЯВКУ'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            <EnrollModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialCourseId={selectedCourseForModal}
                courseTitle={courses.find(c => c.id === selectedCourseForModal)?.title}
            />

        </main>
    )
}