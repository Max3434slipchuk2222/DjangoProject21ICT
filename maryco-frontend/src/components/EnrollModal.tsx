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
        setAge(''); // Очищаємо вік
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded-3xl p-8 relative shadow-2xl animate-in fade-in zoom-in duration-200 overflow-y-auto max-h-[90vh]">

                <button
                    onClick={handleClose}
                    className="absolute top-5 right-5 text-gray-400 hover:text-gray-900 transition-colors bg-gray-100 rounded-full p-2"
                >
                    <X size={20} />
                </button>

                {isSuccess ? (
                    <div className="flex flex-col items-center text-center py-6 gap-4">
                        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center text-4xl mb-2">
                            ✓
                        </div>
                        <h3 className="text-2xl font-black text-gray-900">Заявку прийнято!</h3>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            {courseTitle ? `Ви залишили заявку на курс «${courseTitle}». ` : ''}
                            Наш менеджер зателефонує вам найближчим часом.
                        </p>
                        <button
                            onClick={handleClose}
                            className="mt-4 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-3 px-8 rounded-xl transition-colors"
                        >
                            Зрозуміло
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="mb-8 pr-8">
                            <h2 className="text-2xl font-black text-gray-900 mb-2">
                                Залишити заявку
                            </h2>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                {courseTitle
                                    ? <span>Курс: <strong className="text-blue-600">{courseTitle}</strong></span>
                                    : 'Заповніть форму, і ми підберемо для вас найкращий час.'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                            {!initialCourseId && (
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold text-gray-700 text-sm">Оберіть курс (необов'язково)</label>
                                    <select
                                        value={selectedCourse || ''}
                                        onChange={(e) => setSelectedCourse(e.target.value ? Number(e.target.value) : null)}
                                        className="px-5 py-4 border-2 border-gray-100 focus:border-blue-500 bg-gray-50 focus:bg-white rounded-xl font-medium outline-none text-gray-900 transition-all cursor-pointer"
                                    >
                                        <option value="">Я ще не визначився</option>
                                        {courses.map(c => (
                                            <option key={c.id} value={c.id}>{c.title}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="flex flex-col gap-2">
                                <label className="font-bold text-gray-700 text-sm">Ваше ім'я</label>
                                <input
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Ім'я Прізвище"
                                    className="px-5 py-4 border-2 border-gray-100 focus:border-blue-500 bg-gray-50 focus:bg-white rounded-xl font-medium outline-none text-gray-900 transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold text-gray-700 text-sm">Телефон</label>
                                    <PatternFormat
                                        format="+380 (##) ###-##-##"
                                        allowEmptyFormatting
                                        mask="_"
                                        type="tel"
                                        required
                                        value={phone}
                                        onValueChange={(values) => setPhone(values.formattedValue)}
                                        className="px-5 py-4 border-2 border-gray-100 focus:border-blue-500 bg-gray-50 focus:bg-white rounded-xl font-medium outline-none text-gray-900 transition-all"
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
                                    <label className="font-bold text-gray-700 text-sm">Вік дитини</label>
                                    <input
                                        type="text"
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                        placeholder="Напр. 10 років"
                                        className="px-5 py-4 border-2 border-gray-100 focus:border-blue-500 bg-gray-50 focus:bg-white rounded-xl font-medium outline-none text-gray-900 transition-all"
                                    />
                                </div>
                            </div>

                            {isError && (
                                <div className="text-red-500 text-sm font-bold text-center mt-2">
                                    Помилка. Перевірте дані та спробуйте ще раз.
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-black py-4 rounded-xl tracking-widest transition-all text-lg hover:shadow-lg hover:shadow-blue-200 mt-2"
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