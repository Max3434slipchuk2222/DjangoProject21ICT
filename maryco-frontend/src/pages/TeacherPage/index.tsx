import { useState } from 'react';
import { useGetTeachersQuery } from '../../services/marycoApi';
import type { ITeacher } from '../../types/teacher/ITeacher';

export default function TeachersPage() {
    const { data: teachers = [], isLoading, error } = useGetTeachersQuery();
    const [selectedTeacher, setSelectedTeacher] = useState<ITeacher | null>(null);

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center transition-colors">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 bg-blue-200 dark:bg-blue-900 rounded-full mb-4 transition-colors"></div>
                    <span className="text-gray-400 dark:text-gray-500 font-bold transition-colors">Завантаження...</span>
                </div>
            </div>
        );
    }

    return (
        <section className="max-w-6xl mx-auto px-4 py-16 min-h-screen transition-colors">
            <header className="mb-16 text-center">
                <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-4 transition-colors">Наші викладачі</h1>
                <div className="w-24 h-1.5 bg-blue-600 dark:bg-blue-500 mx-auto rounded-full transition-colors"></div>
                <p className="text-gray-500 dark:text-gray-400 mt-4 text-lg transition-colors">Досвідчені педагоги які надихають на результат</p>
            </header>

            {error && (
                <p className="text-red-500 dark:text-red-400 text-center mb-10 transition-colors">Не вдалося завантажити список викладачів</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {teachers.length > 0 ? (
                    teachers.map((teacher) => (
                        <div key={teacher.id} className="group bg-white dark:bg-slate-900 rounded-3xl shadow-md dark:shadow-none hover:shadow-xl border border-transparent dark:border-slate-800 transition-all duration-300 overflow-hidden flex flex-col md:flex-row">
                            <div className="relative w-full md:w-48 h-56 md:h-auto flex-shrink-0">
                                {teacher.photo ? (
                                    <img
                                        src={teacher.photo.startsWith('http') ? teacher.photo : `http://127.0.0.1:8000${teacher.photo}`}
                                        alt={teacher.full_name}
                                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => {
                                            const img = e.target as HTMLImageElement
                                            img.style.display = 'none'
                                            const fallback = img.parentElement?.querySelector('.fallback-initials')
                                            if (fallback) fallback.classList.remove('hidden')
                                        }}
                                    />
                                ) : null}
                                <div className={`fallback-initials w-full h-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center ${teacher.photo ? 'hidden' : ''}`}>
                                    <span className="text-4xl font-black text-white">{getInitials(teacher.full_name)}</span>
                                </div>
                                {teacher.experience && (
                                    <div className="absolute bottom-3 left-3">
                                        <span className="bg-blue-600 dark:bg-blue-500 text-white text-xs font-black px-3 py-1 rounded-full transition-colors">
                                            {teacher.experience}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 flex flex-col justify-between flex-1">
                                <div>
                                    <h3 className="font-black text-gray-900 dark:text-white text-xl mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {teacher.full_name}
                                    </h3>
                                    <span className="inline-block bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-widest mb-4 transition-colors">
                                        {teacher.subject}
                                    </span>
                                    {teacher.bio && (
                                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-3 italic transition-colors">
                                            "{teacher.bio}"
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-slate-800 transition-colors">
                                    {teacher.experience ? (
                                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 transition-colors">
                                            <span>⭐</span>
                                            <span className="font-semibold">{teacher.experience}</span>
                                        </div>
                                    ) : <div />}
                                    <button
                                        onClick={() => setSelectedTeacher(teacher)}
                                        className="text-blue-600 dark:text-blue-400 font-black text-sm hover:underline transition-colors"
                                    >
                                        Детальніше →
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center bg-gray-50 dark:bg-slate-900 rounded-3xl border-2 border-dashed border-gray-200 dark:border-slate-800 transition-colors">
                        <p className="text-gray-400 dark:text-gray-500 font-bold transition-colors">Викладачі незабаром з'являться</p>
                    </div>
                )}
            </div>

            {selectedTeacher && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={() => setSelectedTeacher(null)}
                >
                    <div
                        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden transition-colors"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="relative h-64">
                            {selectedTeacher.photo ? (
                                <img
                                    src={selectedTeacher.photo.startsWith('http') ? selectedTeacher.photo : `http://127.0.0.1:8000${selectedTeacher.photo}`}
                                    alt={selectedTeacher.full_name}
                                    className="w-full h-full object-cover object-top"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                                    <span className="text-6xl font-black text-white">
                                        {getInitials(selectedTeacher.full_name)}
                                    </span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                            <div className="absolute bottom-4 left-6 right-6">
                                <h2 className="font-black text-white text-2xl">{selectedTeacher.full_name}</h2>
                                <span className="text-blue-300 dark:text-blue-400 font-bold text-sm transition-colors">{selectedTeacher.subject}</span>
                            </div>
                            <button
                                onClick={() => setSelectedTeacher(null)}
                                className="absolute top-4 right-4 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors font-black"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6 flex flex-col gap-4">
                            {selectedTeacher.experience && (
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">⭐</span>
                                    <div>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider transition-colors">Досвід</p>
                                        <p className="font-black text-gray-900 dark:text-white transition-colors">{selectedTeacher.experience}</p>
                                    </div>
                                </div>
                            )}
                            {selectedTeacher.bio && (
                                <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-4 transition-colors">
                                    <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mb-2 transition-colors">Про викладача</p>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm italic transition-colors">
                                        "{selectedTeacher.bio}"
                                    </p>
                                </div>
                            )}
                            {selectedTeacher.courses && selectedTeacher.courses.length > 0 && (
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 transition-colors">
                                    <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mb-3 transition-colors">
                                        Веде курси
                                    </p>
                                    <div className="flex flex-col gap-2">
                                        {selectedTeacher.courses.map(course => (
                                            <div key={course.id} className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-xl px-4 py-2.5 shadow-sm dark:shadow-none transition-colors">
                                                <span className="font-bold text-gray-800 dark:text-gray-200 text-sm transition-colors">{course.title}</span>
                                                <span className="font-black text-blue-600 dark:text-blue-400 text-sm transition-colors">{course.price} грн/міс</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <button
                                onClick={() => setSelectedTeacher(null)}
                                className="w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-black py-3 rounded-xl transition-colors mt-2"
                            >
                                Закрити
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}