import { useState, useEffect } from 'react';
import { PatternFormat } from 'react-number-format';
import { useGetCoursesQuery, useSubmitTrialLessonMutation } from '../services/marycoApi';
import { X } from 'lucide-react';

interface EnrollModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialCourseId?: number | null;
    courseTitle?: string;
}

export default function EnrollModal({ isOpen, onClose, initialCourseId, courseTitle }: EnrollModalProps) {
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [age, setAge] = useState('');
    const [selectedCourse, setSelectedCourse] = useState<number | null>(initialCourseId || null);

    useEffect(() => {
        setSelectedCourse(initialCourseId || null);
    }, [initialCourseId]);

    const { data: courses = [] } = useGetCoursesQuery();
    const [submitTrial, { isLoading, isSuccess, isError, reset }] = useSubmitTrialLessonMutation();

    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const handleClose = () => {
        setFullName('');
        setPhone('');
        setAge('');
        reset();
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await submitTrial({
            full_name: fullName,
            phone,
            child_age: age,
            course: selectedCourse
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-colors">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-8 relative shadow-2xl dark:shadow-none border border-transparent dark:border-slate-800 animate-in fade-in zoom-in duration-200 overflow-y-auto max-h-[90vh] transition-colors">

                <button
                    onClick={handleClose}
                    className="absolute top-5 right-5 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors bg-gray-100 dark:bg-slate-800 rounded-full p-2"
                >
                    <X size={20} />
                </button>

                {isSuccess ? (
                    <div className="flex flex-col items-center text-center py-6 gap-4">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-500 dark:text-green-400 rounded-full flex items-center justify-center text-4xl mb-2 transition-colors">
                            ✓
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white transition-colors">Заявку прийнято!</h3>
                        <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed transition-colors">
                            {courseTitle ? `Ви залишили заявку на курс «${courseTitle}». ` : ''}
                            Наш менеджер зателефонує вам найближчим часом.
                        </p>
                        <button
                            onClick={handleClose}
                            className="mt-4 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-900 dark:text-white font-bold py-3 px-8 rounded-xl transition-colors"
                        >
                            Зрозуміло
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="mb-8 pr-8">
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 transition-colors">
                                Залишити заявку
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed transition-colors">
                                {courseTitle
                                    ? <span>Курс: <strong className="text-blue-600 dark:text-blue-400 transition-colors">{courseTitle}</strong></span>
                                    : 'Заповніть форму, і ми підберемо для вас найкращий час.'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                            {!initialCourseId && (
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold text-gray-700 dark:text-gray-300 text-sm transition-colors">Оберіть курс (необов'язково)</label>
                                    <select
                                        value={selectedCourse || ''}
                                        onChange={(e) => setSelectedCourse(e.target.value ? Number(e.target.value) : null)}
                                        className="px-5 py-4 border-2 border-gray-100 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 bg-gray-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 rounded-xl font-medium outline-none text-gray-900 dark:text-white transition-all cursor-pointer"
                                    >
                                        <option value="">Я ще не визначився</option>
                                        {courses.map(c => (
                                            <option key={c.id} value={c.id}>{c.title}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="flex flex-col gap-2">
                                <label className="font-bold text-gray-700 dark:text-gray-300 text-sm transition-colors">Ваше ім'я</label>
                                <input
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Ім'я Прізвище"
                                    className="px-5 py-4 border-2 border-gray-100 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 bg-gray-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 rounded-xl font-medium outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold text-gray-700 dark:text-gray-300 text-sm transition-colors">Телефон</label>
                                    <PatternFormat
                                        format="+380 (##) ###-##-##"
                                        allowEmptyFormatting
                                        mask="_"
                                        type="tel"
                                        required
                                        value={phone}
                                        onValueChange={(values) => setPhone(values.formattedValue)}
                                        className="px-5 py-4 border-2 border-gray-100 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 bg-gray-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 rounded-xl font-medium outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                                        onFocus={(e) => {
                                            const input = e.target;
                                            setTimeout(() => {
                                                if (input.value.replace(/\D/g, '') === '380') {
                                                    input.setSelectionRange(6, 6);
                                                }
                                            }, 0);
                                        }}
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="font-bold text-gray-700 dark:text-gray-300 text-sm transition-colors">Вік дитини</label>
                                    <input
                                        type="text"
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                        placeholder="Напр. 10 років"
                                        className="px-5 py-4 border-2 border-gray-100 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 bg-gray-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 rounded-xl font-medium outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                                    />
                                </div>
                            </div>

                            {isError && (
                                <div className="text-red-500 dark:text-red-400 text-sm font-bold text-center mt-2 transition-colors">
                                    Помилка. Перевірте дані та спробуйте ще раз.
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 disabled:bg-blue-400 dark:disabled:bg-blue-800 text-white font-black py-4 rounded-xl tracking-widest transition-all text-lg hover:shadow-lg hover:shadow-blue-200 dark:hover:shadow-none mt-2"
                            >
                                {isLoading ? 'ВІДПРАВКА...' : 'ВІДПРАВИТИ'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}