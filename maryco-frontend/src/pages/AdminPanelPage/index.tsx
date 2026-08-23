import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import {
    LayoutDashboard, BookOpen, Newspaper, Tag,
    MessageSquare, ClipboardList, Plus, Pencil, Trash2,
    Check, X, Search, Eye,
    GraduationCap, Star, Phone, Calendar, AlertTriangle,
    Upload, Image as ImageIcon, ChevronLeft, Users,
} from 'lucide-react';
import {
    useGetCoursesQuery, useGetTeachersQuery, useGetNewsQuery,
    useGetPromotionsQuery, useGetReviewsQuery, useGetCategoriesQuery,
    useGetTrialLessonsQuery, useSetTrialStatusMutation,
    useCreateTeacherMutation, useUpdateTeacherMutation, useDeleteTeacherMutation,
    useCreateCourseMutation, useUpdateCourseMutation, useDeleteCourseMutation,
    useCreateNewsMutation, useUpdateNewsMutation, useDeleteNewsMutation,
    useCreatePromotionMutation, useUpdatePromotionMutation, useDeletePromotionMutation,
    useToggleReviewPublishMutation, useDeleteReviewMutation,
    useGetStudentsQuery, useCreateStudentMutation, useUpdateStudentMutation, useDeleteStudentMutation,
} from '../../services/marycoApi';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Student {
    id: number;
    full_name: string;
    courses?: Array<{ id: number; title: string }>;
    created_at: string;
}

type Section = 'dashboard' | 'courses' | 'teachers' | 'students' | 'news' | 'promotions' | 'reviews' | 'trials';

const API = import.meta.env.VITE_API_BASE_URL;
const mediaUrl = (p: string | null | undefined) =>
    p ? (p.startsWith('http') ? p : `${API}${p}`) : null;

const navItems: { id: Section; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'dashboard',  label: 'Дашборд',   icon: <LayoutDashboard size={17}/>, color: 'text-blue-500'   },
    { id: 'courses',    label: 'Курси',      icon: <BookOpen size={17}/>,        color: 'text-indigo-500' },
    { id: 'teachers',   label: 'Вчителі',    icon: <GraduationCap size={17}/>,   color: 'text-violet-500' },
    { id: 'students',   label: 'Студенти',   icon: <Users size={17}/>,           color: 'text-cyan-500'   },
    { id: 'news',       label: 'Новини',     icon: <Newspaper size={17}/>,       color: 'text-sky-500'    },
    { id: 'promotions', label: 'Акції',      icon: <Tag size={17}/>,             color: 'text-amber-500'  },
    { id: 'reviews',    label: 'Відгуки',    icon: <MessageSquare size={17}/>,   color: 'text-emerald-500'},
    { id: 'trials',     label: 'Заявки',     icon: <ClipboardList size={17}/>,   color: 'text-rose-500'   },
];

// ─── Shared UI ────────────────────────────────────────────────────────────────

function Input({ label, value, onChange, type = 'text', placeholder, required }: {
    label: string; value: string; onChange: (v: string) => void;
    type?: string; placeholder?: string; required?: boolean;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-widest">
                {label}{required && <span className="text-red-400 ml-0.5">*</span>}
            </label>
            <input
                type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
                className="bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-all"
            />
        </div>
    );
}

function Textarea({ label, value, onChange, rows = 3, placeholder }: {
    label: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-widest">{label}</label>
            <textarea
                value={value} rows={rows} onChange={e => onChange(e.target.value)} placeholder={placeholder}
                className="bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-all resize-none"
            />
        </div>
    );
}

function SelectField({ label, value, onChange, options }: {
    label: string; value: string; onChange: (v: string) => void;
    options: { value: string; label: string }[];
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-widest">{label}</label>
            <select
                value={value} onChange={e => onChange(e.target.value)}
                // dark:[color-scheme:dark] змушує нативний select рендеритись у темних тонах у браузерах що це підтримують
                className="bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-all appearance-none dark:[color-scheme:dark]"
            >
                {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
        </div>
    );
}

function MultiSelect({ label, options, selected, onChange }: {
    label: string;
    options: { value: string; label: string; photo?: string | null }[];
    selected: string[];
    onChange: (ids: string[]) => void;
}) {
    const toggle = (v: string) =>
        onChange(selected.includes(v) ? selected.filter(s => s !== v) : [...selected, v]);

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-widest">{label}</label>
            {/* Вибрані теги */}
            <div className="bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-2 flex flex-wrap gap-2 min-h-[44px]">
                {selected.length === 0 && (
                    <span className="text-gray-400 dark:text-gray-400 text-sm px-1.5 py-1">Нічого не вибрано</span>
                )}
                {selected.map(v => {
                    const opt = options.find(o => o.value === v);
                    return opt ? (
                        <span key={v} className="flex items-center gap-1.5 bg-blue-100 dark:bg-blue-500/20 border border-blue-300 dark:border-blue-500/30 text-blue-700 dark:text-blue-300 text-xs font-bold px-2.5 py-1 rounded-lg">
                            {opt.photo && <img src={opt.photo} alt="" className="w-4 h-4 rounded-full object-cover"/>}
                            {opt.label}
                            <button type="button" onClick={() => toggle(v)} className="text-blue-500 hover:text-blue-900 dark:hover:text-white ml-0.5 transition-colors"><X size={11}/></button>
                        </span>
                    ) : null;
                })}
            </div>
            {/* Список варіантів */}
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden max-h-44 overflow-y-auto">
                {options.map(opt => {
                    const isSel = selected.includes(opt.value);
                    return (
                        <button key={opt.value} type="button" onClick={() => toggle(opt.value)}
                                className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors text-left ${
                                    isSel
                                        ? 'bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700/50'
                                }`}>
                            {opt.photo && <img src={opt.photo} alt="" className="w-6 h-6 rounded-full object-cover flex-shrink-0"/>}
                            <span className="flex-1">{opt.label}</span>
                            {isSel && <Check size={13} className="text-blue-500 dark:text-blue-400 flex-shrink-0"/>}
                        </button>
                    );
                })}
                {options.length === 0 && (
                    <p className="px-3 py-4 text-sm text-gray-400 dark:text-gray-400 text-center">Немає варіантів</p>
                )}
            </div>
        </div>
    );
}

function ImageUpload({ label, onChange, preview }: {
    label: string; value: File | null; onChange: (f: File | null) => void; preview?: string | null;
}) {
    const ref = useRef<HTMLInputElement>(null);
    const [localPreview, setLocalPreview] = useState<string | null>(null);
    const handleFile = (f: File) => {
        onChange(f);
        const reader = new FileReader();
        reader.onload = e => setLocalPreview(e.target?.result as string);
        reader.readAsDataURL(f);
    };
    const src = localPreview || mediaUrl(preview);
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-widest">{label}</label>
            <div
                onClick={() => ref.current?.click()}
                className="relative h-36 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-600 overflow-hidden cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors group bg-gray-50 dark:bg-slate-800/50"
            >
                {src
                    ? <img src={src} alt="" className="w-full h-full object-cover"/>
                    : <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-400 dark:text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors">
                        <ImageIcon size={28}/><span className="text-xs">Клікніть для завантаження</span>
                    </div>
                }
                {src && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Upload size={20} className="text-white"/>
                    </div>
                )}
            </div>
            <input ref={ref} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}/>
        </div>
    );
}

function Modal({ title, onClose, children, width = 'max-w-lg' }: {
    title: string; onClose: () => void; children: React.ReactNode; width?: string;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-2xl w-full ${width} max-h-[90vh] flex flex-col`}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex-shrink-0">
                    <h3 className="font-black text-gray-900 dark:text-white text-base">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-gray-400 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    >
                        <X size={18}/>
                    </button>
                </div>
                {/* Скролиться тільки вміст, фон завжди правильний */}
                <div className="overflow-y-auto flex-1 px-6 py-5 bg-white dark:bg-gray-900 rounded-b-2xl">
                    {children}
                </div>
            </div>
        </div>
    );
}

function ConfirmModal({ title, body, onConfirm, onCancel }: {
    title: string; body?: string; onConfirm: () => void; onCancel: () => void;
}) {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 shadow-2xl max-w-sm w-full">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-rose-500/10 border border-red-200 dark:border-rose-500/20 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle size={18} className="text-red-500 dark:text-rose-400"/>
                    </div>
                    <p className="font-black text-gray-900 dark:text-white">{title}</p>
                </div>
                {body && <p className="text-sm text-gray-500 dark:text-gray-300 mb-5 leading-relaxed">{body}</p>}
                <div className="flex gap-3 mt-5">
                    <button onClick={onCancel} className="flex-1 py-2.5 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-sm">
                        Скасувати
                    </button>
                    <button onClick={onConfirm} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-black rounded-xl transition-colors text-sm">
                        Видалити
                    </button>
                </div>
            </div>
        </div>
    );
}

function SaveButton({ loading, onClick, label = 'Зберегти' }: { loading?: boolean; onClick: () => void; label?: string }) {
    return (
        <button
            onClick={onClick} disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black rounded-xl transition-colors text-sm mt-2"
        >
            {loading ? 'Збереження...' : label}
        </button>
    );
}

function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    return (
        <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-400"/>
            <input
                value={value} onChange={e => onChange(e.target.value)} placeholder="Пошук..."
                className="w-full pl-9 pr-4 py-2.5 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors"
            />
        </div>
    );
}

function Badge({ children, color = 'blue' }: { children: React.ReactNode; color?: string }) {
    const colors: Record<string, string> = {
        blue:    'bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/25',
        indigo:  'bg-indigo-100 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/25',
        violet:  'bg-violet-100 dark:bg-violet-500/15 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-500/25',
        cyan:    'bg-cyan-100 dark:bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/25',
        emerald: 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/25',
        rose:    'bg-red-100 dark:bg-rose-500/15 text-red-700 dark:text-rose-300 border border-red-200 dark:border-rose-500/25',
        amber:   'bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/25',
        // slate виправлений — був майже невидимий у dark
        slate:   'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-200 border border-gray-200 dark:border-slate-600',
    };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${colors[color] ?? colors.blue}`}>
            {children}
        </span>
    );
}

function SkeletonRow({ cols }: { cols: number }) {
    return (
        <tr className="animate-pulse border-b border-gray-100 dark:border-slate-700">
            {Array(cols + 1).fill(0).map((_, i) => (
                <td key={i} className="px-4 py-3.5">
                    <div className="h-3.5 bg-gray-200 dark:bg-slate-700 rounded-lg"/>
                </td>
            ))}
        </tr>
    );
}

function SectionHeader({ title, subtitle, onAdd, addLabel, addColor }: {
    title: string; subtitle: string; onAdd: () => void; addLabel: string; addColor: string;
}) {
    return (
        <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">{title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>
            </div>
            <button onClick={onAdd} className={`flex items-center gap-2 ${addColor} text-white font-bold px-4 py-2.5 rounded-xl transition-colors text-sm flex-shrink-0`}>
                <Plus size={16}/> {addLabel}
            </button>
        </div>
    );
}

function EmptyState({ label }: { label: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-500">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center mb-3">
                <Eye size={20} className="text-gray-400 dark:text-gray-500"/>
            </div>
            <p className="text-sm font-bold">{label}</p>
        </div>
    );
}

// ─── Generic Table ────────────────────────────────────────────────────────────

function AdminTable<T extends { id: number }>({
                                                  data, columns, onEdit, onDelete, isLoading, renderCell,
                                              }: {
    data: T[];
    columns: { key: string; label: string; width?: string }[];
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    isLoading?: boolean;
    renderCell?: (item: T, key: string) => React.ReactNode;
}) {
    const [search, setSearch] = useState('');
    const filtered = data.filter(item =>
        JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
    );
    return (
        <div>
            <div className="mb-4"><SearchBar value={search} onChange={setSearch}/></div>
            <div className="rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                        <tr className="bg-gray-50 dark:bg-slate-800/60 border-b border-gray-200 dark:border-slate-700">
                            {columns.map(col => (
                                <th key={col.key} style={{ width: col.width }}
                                    className="px-4 py-3 text-left text-[11px] font-black text-gray-400 dark:text-gray-400 uppercase tracking-widest">
                                    {col.label}
                                </th>
                            ))}
                            <th className="px-4 py-3 text-right text-[11px] font-black text-gray-400 dark:text-gray-400 uppercase tracking-widest w-20">Дії</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                        {isLoading
                            ? Array(5).fill(0).map((_, i) => <SkeletonRow key={i} cols={columns.length}/>)
                            : filtered.length === 0
                                ? <tr><td colSpan={columns.length + 1} className="px-4 py-14 text-center text-gray-400 dark:text-gray-500 text-sm">Нічого не знайдено</td></tr>
                                : filtered.map(item => (
                                    <tr key={item.id} className="bg-white dark:bg-slate-800/40 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                                        {columns.map(col => (
                                            <td key={col.key} className="px-4 py-3.5 text-gray-600 dark:text-gray-300">
                                                {renderCell ? renderCell(item, col.key) : String((item as Record<string, unknown>)[col.key] ?? '—')}
                                            </td>
                                        ))}
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center justify-end gap-1">
                                                {onEdit && (
                                                    <button onClick={() => onEdit(item)}
                                                            className="p-1.5 rounded-lg text-gray-400 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors">
                                                        <Pencil size={14}/>
                                                    </button>
                                                )}
                                                {onDelete && (
                                                    <button onClick={() => onDelete(item)}
                                                            className="p-1.5 rounded-lg text-gray-400 dark:text-gray-400 hover:text-red-500 dark:hover:text-rose-400 hover:bg-red-50 dark:hover:bg-rose-500/10 transition-colors">
                                                        <Trash2 size={14}/>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                        }
                        </tbody>
                    </table>
                </div>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-right">{filtered.length} із {data.length} записів</p>
        </div>
    );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────

function DashboardSection() {
    const { data: courses = [] } = useGetCoursesQuery();
    const { data: teachers = [] } = useGetTeachersQuery();
    const { data: reviews = [] } = useGetReviewsQuery();
    const { data: news = [] } = useGetNewsQuery();
    const { data: trials = [] } = useGetTrialLessonsQuery();
    const { data: rawStudents } = useGetStudentsQuery();
    const students: Student[] = (rawStudents as Student[] | undefined) ?? [];

    const newTrials = (trials as any[]).filter((t: any) => t.status === 'new').length;
    const avgRating = reviews.length
        ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
        : '—';

    const stats = [
        { label: 'Курсів',       value: courses.length,  icon: <BookOpen size={20}/>,      from: 'from-blue-600',   to: 'to-indigo-600'  },
        { label: 'Вчителів',     value: teachers.length, icon: <GraduationCap size={20}/>, from: 'from-violet-600', to: 'to-purple-600'  },
        { label: 'Студентів',    value: students.length, icon: <Users size={20}/>,          from: 'from-cyan-600',   to: 'to-teal-600'    },
        { label: 'Нових заявок', value: newTrials,        icon: <ClipboardList size={20}/>, from: 'from-rose-600',   to: 'to-pink-600'    },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1">Огляд</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Загальна статистика школи</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map(s => (
                    <div key={s.label} className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 overflow-hidden">
                        <div className={`absolute inset-0 bg-gradient-to-br ${s.from} ${s.to} opacity-[0.04] dark:opacity-[0.08]`}/>
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.from} ${s.to} flex items-center justify-center mb-4 text-white`}>
                            {s.icon}
                        </div>
                        <p className="text-3xl font-black text-gray-900 dark:text-white">{s.value}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mt-1">{s.label}</p>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-slate-700 rounded-2xl p-5">
                    <p className="text-xs font-black text-gray-400 dark:text-gray-400 uppercase tracking-widest mb-4">Середня оцінка</p>
                    <div className="flex items-center gap-3">
                        <span className="text-5xl font-black text-amber-500 dark:text-amber-400">{avgRating}</span>
                        <div className="flex flex-col gap-1">
                            <div className="flex gap-0.5">
                                {[1,2,3,4,5].map(i => (
                                    <Star key={i} size={16} className={i <= Math.round(Number(avgRating)) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 dark:text-gray-700'}/>
                                ))}
                            </div>
                            <span className="text-xs text-gray-400 dark:text-gray-400">{reviews.length} відгуків</span>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-slate-700 rounded-2xl p-5">
                    <p className="text-xs font-black text-gray-400 dark:text-gray-400 uppercase tracking-widest mb-4">Останні відгуки</p>
                    <div className="space-y-2.5">
                        {reviews.slice(0, 4).map(r => {
                            const name = r.user.first_name || r.user.username;
                            return (
                                <div key={r.id} className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-500/15 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xs font-black flex-shrink-0">
                                        {name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm text-gray-700 dark:text-gray-300 flex-1 truncate">{name}</span>
                                    <div className="flex gap-0.5 flex-shrink-0">
                                        {[1,2,3,4,5].map(i => (
                                            <Star key={i} size={10} className={i <= r.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 dark:text-gray-700'}/>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                        {reviews.length === 0 && <p className="text-sm text-gray-400 dark:text-gray-500">Немає відгуків</p>}
                    </div>
                </div>
            </div>
            {news.length > 0 && (
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-slate-700 rounded-2xl p-5">
                    <p className="text-xs font-black text-gray-400 dark:text-gray-400 uppercase tracking-widest mb-4">Останні новини</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {news.slice(0,3).map(n => (
                            <div key={n.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800/60 rounded-xl border border-gray-100 dark:border-slate-700/50">
                                <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-slate-700 overflow-hidden flex-shrink-0">
                                    {mediaUrl(n.image)
                                        ? <img src={mediaUrl(n.image)!} alt="" className="w-full h-full object-cover"/>
                                        : <div className="w-full h-full flex items-center justify-center text-lg">📰</div>
                                    }
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{n.title}</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-400">{new Date(n.created_at).toLocaleDateString('uk-UA')}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── STUDENTS ─────────────────────────────────────────────────────────────────

function StudentsSection() {
    // Типізуємо відповідь явно — RTK Query повертає unknown за замовчуванням якщо API не типізовано
    const { data: rawStudents, isLoading } = useGetStudentsQuery();
    const students: Student[] = (rawStudents as Student[] | undefined) ?? [];

    const { data: courses = [] } = useGetCoursesQuery();
    const [createStudent, { isLoading: creating }] = useCreateStudentMutation();
    const [updateStudent, { isLoading: updating }] = useUpdateStudentMutation();
    const [deleteStudent] = useDeleteStudentMutation();

    type FormState = { full_name: string; courseIds: string[] };
    const emptyForm: FormState = { full_name: '', courseIds: [] };

    const [modal, setModal] = useState<null | 'create' | 'edit'>(null);
    const [editItem, setEditItem] = useState<Student | null>(null);
    const [form, setForm] = useState<FormState>(emptyForm);
    const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);
    const [error, setError] = useState('');

    const openCreate = () => {
        setForm(emptyForm);
        setEditItem(null);
        setError('');
        setModal('create');
    };

    const openEdit = (item: Student) => {
        setForm({
            full_name: item.full_name,
            courseIds: (item.courses ?? []).map(c => String(c.id)),
        });
        setEditItem(item);
        setError('');
        setModal('edit');
    };

    const handleSave = async () => {
        if (!form.full_name.trim()) {
            setError("Ім'я обов'язкове");
            return;
        }
        // Payload відповідає очікуваному бекендом: courses — масив id
        const payload = {
            full_name: form.full_name.trim(),
            course_ids: form.courseIds.map(Number),
        };
        try {
            if (modal === 'create') {
                await createStudent(payload).unwrap();
            } else if (editItem) {
                await updateStudent({ id: editItem.id, data: payload }).unwrap();
            }
            setModal(null);
            setForm(emptyForm);
        } catch (e) {
            console.error(e);
            setError('Помилка збереження. Перевірте дані.');
        }
    };

    const courseOptions = (courses as any[]).map(c => ({
        value: String(c.id),
        label: c.title as string,
        photo: null,
    }));

    // Статистика
    const withCourses = students.filter(s => (s.courses?.length ?? 0) > 0).length;
    const withoutCourses = students.length - withCourses;
    const avgCourses = students.length
        ? (students.reduce((sum, s) => sum + (s.courses?.length ?? 0), 0) / students.length).toFixed(1)
        : '0';

    return (
        <div className="space-y-4">
            <SectionHeader
                title="Студенти"
                subtitle={`${students.length} студентів`}
                onAdd={openCreate}
                addLabel="Додати студента"
                addColor="bg-cyan-600 hover:bg-cyan-500"
            />

            <AdminTable<Student>
                data={students}
                isLoading={isLoading}
                columns={[
                    { key: 'avatar',     label: '',            width: '52px'  },
                    { key: 'full_name',  label: "Ім'я",        width: '35%'   },
                    { key: 'courses',    label: 'Курси',        width: '45%'   },
                    { key: 'created_at', label: 'Доданий',     width: '130px' },
                ]}
                renderCell={(item, key) => {
                    if (key === 'avatar') return (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-black text-sm">
                                {item.full_name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    );
                    if (key === 'full_name') return (
                        <span className="font-bold text-gray-900 dark:text-white">{item.full_name}</span>
                    );
                    if (key === 'courses') return (
                        <div className="flex flex-wrap gap-1">
                            {(item.courses ?? []).length === 0
                                ? <span className="text-gray-400 dark:text-gray-500 text-xs">Без курсів</span>
                                : (item.courses ?? []).map(c => (
                                    <span key={c.id} className="bg-cyan-100 dark:bg-cyan-500/15 border border-cyan-200 dark:border-cyan-500/25 text-cyan-700 dark:text-cyan-300 text-xs font-bold px-2 py-0.5 rounded-full">
                                        {c.title}
                                    </span>
                                ))
                            }
                        </div>
                    );
                    if (key === 'created_at') return (
                        <span className="text-gray-400 dark:text-gray-400 text-xs">
                            {item.created_at
                                ? new Date(item.created_at).toLocaleDateString('uk-UA')
                                : '—'
                            }
                        </span>
                    );
                    return '—';
                }}
                onEdit={openEdit}
                onDelete={setDeleteTarget}
            />

            {/* Статистика */}
            {students.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { label: 'Всього студентів',        value: students.length },
                        { label: 'З курсами',                value: withCourses     },
                        { label: 'Без курсів',               value: withoutCourses  },
                        { label: 'Середня кількість курсів', value: avgCourses      },
                    ].map(stat => (
                        <div key={stat.label} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
                            <p className="text-2xl font-black text-gray-900 dark:text-white">{stat.value}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-400 mt-0.5">{stat.label}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Модалка */}
            {modal && (
                <Modal
                    title={modal === 'create' ? 'Новий студент' : 'Редагувати студента'}
                    onClose={() => setModal(null)}
                >
                    <div className="space-y-4">
                        {/* Превью */}
                        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-800/60 rounded-xl border border-gray-100 dark:border-slate-700">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-black text-2xl">
                                    {form.full_name ? form.full_name.charAt(0).toUpperCase() : '?'}
                                </span>
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 dark:text-white text-sm">
                                    {form.full_name || 'Введіть ім\'я...'}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-400 mt-0.5">
                                    {form.courseIds.length === 0
                                        ? 'Без курсів'
                                        : `${form.courseIds.length} ${form.courseIds.length === 1 ? 'курс' : form.courseIds.length < 5 ? 'курси' : 'курсів'}`
                                    }
                                </p>
                            </div>
                        </div>

                        <Input
                            label="Повне ім'я"
                            value={form.full_name}
                            onChange={v => setForm(p => ({ ...p, full_name: v }))}
                            required
                            placeholder="Іваненко Іван Іванович"
                        />

                        <MultiSelect
                            label="Курси"
                            options={courseOptions}
                            selected={form.courseIds}
                            onChange={ids => setForm(p => ({ ...p, courseIds: ids }))}
                        />

                        {form.courseIds.length > 0 && (
                            <div className="bg-cyan-50 dark:bg-cyan-500/5 border border-cyan-200 dark:border-cyan-500/20 rounded-xl p-3">
                                <p className="text-xs font-bold text-cyan-700 dark:text-cyan-400 mb-2">Вибрані курси:</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {form.courseIds.map(id => {
                                        const c = (courses as any[]).find(c => String(c.id) === id);
                                        return c ? (
                                            <span key={id} className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-cyan-200 dark:border-cyan-500/30 text-cyan-700 dark:text-cyan-300 text-xs font-bold px-2.5 py-1 rounded-lg">
                                                {c.title}
                                                <button
                                                    type="button"
                                                    onClick={() => setForm(p => ({ ...p, courseIds: p.courseIds.filter(i => i !== id) }))}
                                                    className="text-cyan-400 hover:text-red-500 dark:hover:text-rose-400 transition-colors ml-0.5"
                                                >
                                                    <X size={10}/>
                                                </button>
                                            </span>
                                        ) : null;
                                    })}
                                </div>
                            </div>
                        )}

                        {error && (
                            <p className="text-red-500 dark:text-rose-400 text-sm font-bold bg-red-50 dark:bg-rose-500/10 border border-red-200 dark:border-rose-500/20 rounded-xl px-3 py-2">
                                {error}
                            </p>
                        )}
                        <SaveButton loading={creating || updating} onClick={handleSave}/>
                    </div>
                </Modal>
            )}

            {deleteTarget && (
                <ConfirmModal
                    title="Видалити студента?"
                    body={`"${deleteTarget.full_name}" буде видалений з системи та відкріплений від усіх курсів.`}
                    onConfirm={async () => {
                        await deleteStudent(deleteTarget.id);
                        setDeleteTarget(null);
                    }}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}
        </div>
    );
}

// ─── TEACHERS ─────────────────────────────────────────────────────────────────

function TeachersSection() {
    const { data: teachers = [], isLoading } = useGetTeachersQuery();
    const [createTeacher, { isLoading: creating }] = useCreateTeacherMutation();
    const [updateTeacher, { isLoading: updating }] = useUpdateTeacherMutation();
    const [deleteTeacher] = useDeleteTeacherMutation();

    type FormState = { full_name: string; subject: string; experience: string; bio: string; photo: File | null };
    const emptyForm: FormState = { full_name: '', subject: '', experience: '', bio: '', photo: null };

    const [modal, setModal] = useState<null | 'create' | 'edit'>(null);
    const [editItem, setEditItem] = useState<any>(null);
    const [form, setForm] = useState<FormState>(emptyForm);
    const [deleteTarget, setDeleteTarget] = useState<any>(null);
    const [error, setError] = useState('');

    const openCreate = () => { setForm(emptyForm); setEditItem(null); setError(''); setModal('create'); };
    const openEdit = (item: any) => {
        setForm({ full_name: item.full_name, subject: item.subject || '', experience: item.experience || '', bio: item.bio || '', photo: null });
        setEditItem(item); setError(''); setModal('edit');
    };

    const buildFD = () => {
        const fd = new FormData();
        fd.append('full_name', form.full_name);
        fd.append('subject', form.subject);
        fd.append('experience', form.experience);
        fd.append('bio', form.bio);
        if (form.photo) fd.append('photo', form.photo);
        return fd;
    };

    const handleSave = async () => {
        if (!form.full_name.trim()) { setError("Ім'я обов'язкове"); return; }
        try {
            if (modal === 'create') await createTeacher(buildFD() as any).unwrap();
            else await updateTeacher({ id: editItem.id, data: buildFD() as any }).unwrap();
            setModal(null);
        } catch { setError('Помилка збереження'); }
    };

    return (
        <div className="space-y-4">
            <SectionHeader title="Вчителі" subtitle={`${teachers.length} викладачів`} onAdd={openCreate} addLabel="Додати вчителя" addColor="bg-violet-600 hover:bg-violet-500"/>
            <AdminTable
                data={teachers} isLoading={isLoading}
                columns={[
                    { key: 'photo',      label: '',         width: '52px' },
                    { key: 'full_name',  label: "Ім'я",    width: '30%'  },
                    { key: 'subject',    label: 'Предмет',  width: '25%'  },
                    { key: 'experience', label: 'Досвід',   width: '20%'  },
                    { key: 'courses',    label: 'Курсів',   width: '80px' },
                ]}
                renderCell={(item, key) => {
                    if (key === 'photo') return (
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                            {mediaUrl(item.photo)
                                ? <img src={mediaUrl(item.photo)!} alt="" className="w-full h-full object-cover"/>
                                : <span className="text-white font-black text-sm">{item.full_name.charAt(0)}</span>
                            }
                        </div>
                    );
                    if (key === 'full_name') return <span className="font-bold text-gray-900 dark:text-white">{item.full_name}</span>;
                    if (key === 'subject')   return <span className="text-gray-500 dark:text-gray-300">{item.subject}</span>;
                    if (key === 'experience') return <span className="text-gray-500 dark:text-gray-300">{item.experience || '—'}</span>;
                    if (key === 'courses')   return <Badge color="violet">{item.courses?.length ?? 0}</Badge>;
                    return '—';
                }}
                onEdit={openEdit}
                onDelete={setDeleteTarget}
            />
            {modal && (
                <Modal title={modal === 'create' ? 'Новий вчитель' : 'Редагувати вчителя'} onClose={() => setModal(null)}>
                    <div className="space-y-4">
                        <ImageUpload label="Фото" value={form.photo} onChange={f => setForm(p => ({ ...p, photo: f }))} preview={editItem?.photo}/>
                        <Input label="Повне ім'я" value={form.full_name} onChange={v => setForm(p => ({ ...p, full_name: v }))} required placeholder="Іваненко Іван Іванович"/>
                        <Input label="Предмет" value={form.subject} onChange={v => setForm(p => ({ ...p, subject: v }))} placeholder="Математика"/>
                        <Input label="Досвід" value={form.experience} onChange={v => setForm(p => ({ ...p, experience: v }))} placeholder="5 років"/>
                        <Textarea label="Біографія" value={form.bio} onChange={v => setForm(p => ({ ...p, bio: v }))} rows={4}/>
                        {error && <p className="text-red-500 dark:text-rose-400 text-sm">{error}</p>}
                        <SaveButton loading={creating || updating} onClick={handleSave}/>
                    </div>
                </Modal>
            )}
            {deleteTarget && (
                <ConfirmModal title="Видалити вчителя?" body={`"${deleteTarget.full_name}" буде відкріплений від усіх курсів.`}
                              onConfirm={async () => { await deleteTeacher(deleteTarget.id); setDeleteTarget(null); }}
                              onCancel={() => setDeleteTarget(null)}
                />
            )}
        </div>
    );
}

// ─── COURSES ──────────────────────────────────────────────────────────────────

function CoursesSection() {
    const { data: courses = [], isLoading } = useGetCoursesQuery();
    const { data: categories = [] } = useGetCategoriesQuery();
    const { data: teachers = [] } = useGetTeachersQuery();
    const [createCourse, { isLoading: creating }] = useCreateCourseMutation();
    const [updateCourse, { isLoading: updating }] = useUpdateCourseMutation();
    const [deleteCourse] = useDeleteCourseMutation();

    type FormState = { title: string; slug: string; description: string; price: string; category: string; teacherIds: string[]; image: File | null };
    const emptyForm: FormState = { title: '', slug: '', description: '', price: '', category: '', teacherIds: [], image: null };

    const [modal, setModal] = useState<null | 'create' | 'edit'>(null);
    const [editItem, setEditItem] = useState<any>(null);
    const [form, setForm] = useState<FormState>(emptyForm);
    const [deleteTarget, setDeleteTarget] = useState<any>(null);
    const [error, setError] = useState('');

    const openCreate = () => { setForm(emptyForm); setEditItem(null); setError(''); setModal('create'); };
    const openEdit = (item: any) => {
        setForm({ title: item.title, slug: item.slug, description: item.description || '', price: String(item.price || ''), category: String(item.category?.id || ''), teacherIds: (item.teachers ?? []).map((t: any) => String(t.id)), image: null });
        setEditItem(item); setError(''); setModal('edit');
    };

    const buildFD = () => {
        const fd = new FormData();
        fd.append('title', form.title);
        fd.append('slug', form.slug || form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
        fd.append('description', form.description);
        fd.append('price', form.price);
        if (form.category) fd.append('category_id', form.category);
        if (form.image) fd.append('image', form.image);
        form.teacherIds.forEach(id => fd.append('teacher_ids', id));
        return fd;
    };

    const handleSave = async () => {
        if (!form.title.trim()) { setError('Назва обов\'язкова'); return; }
        try {
            if (modal === 'create') await createCourse(buildFD() as any).unwrap();
            else await updateCourse({ slug: editItem.slug, data: buildFD() as any }).unwrap();
            setModal(null);
        } catch { setError('Помилка збереження'); }
    };

    const catOptions = [{ value: '', label: '— Без категорії —' }, ...(categories as any[]).map(c => ({ value: String(c.id), label: c.name }))];
    const teacherOptions = (teachers as any[]).map(t => ({ value: String(t.id), label: t.full_name, photo: mediaUrl(t.photo) }));

    return (
        <div className="space-y-4">
            <SectionHeader title="Курси" subtitle={`${courses.length} курсів`} onAdd={openCreate} addLabel="Додати курс" addColor="bg-blue-600 hover:bg-blue-500"/>
            <AdminTable
                data={courses as any[]} isLoading={isLoading}
                columns={[
                    { key: 'image',    label: '',          width: '52px' },
                    { key: 'title',    label: 'Назва',     width: '30%'  },
                    { key: 'category', label: 'Категорія', width: '18%'  },
                    { key: 'price',    label: 'Ціна',      width: '90px' },
                    { key: 'teachers', label: 'Вчителі',   width: '25%'  },
                ]}
                renderCell={(item, key) => {
                    if (key === 'image') return (
                        <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-800 flex-shrink-0">
                            {mediaUrl(item.image)
                                ? <img src={mediaUrl(item.image)!} alt="" className="w-full h-full object-cover"/>
                                : <div className="w-full h-full flex items-center justify-center text-base">📚</div>
                            }
                        </div>
                    );
                    if (key === 'title') return (
                        <div>
                            <p className="font-bold text-gray-900 dark:text-white text-sm">{item.title}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-400">{item.slug}</p>
                        </div>
                    );
                    if (key === 'category') return <Badge color="indigo">{item.category?.name || '—'}</Badge>;
                    if (key === 'price')    return <span className="font-bold text-gray-900 dark:text-white">{item.price} ₴</span>;
                    if (key === 'teachers') return (
                        <div className="flex flex-wrap gap-1">
                            {(item.teachers ?? []).length === 0
                                ? <span className="text-gray-400 dark:text-gray-500 text-xs">—</span>
                                : (item.teachers ?? []).map((t: any) => (
                                    <span key={t.id} className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full">
                                        {mediaUrl(t.photo) && <img src={mediaUrl(t.photo)!} alt="" className="w-3.5 h-3.5 rounded-full object-cover"/>}
                                        {t.full_name.split(' ')[0]}
                                    </span>
                                ))
                            }
                        </div>
                    );
                    return '—';
                }}
                onEdit={openEdit}
                onDelete={setDeleteTarget}
            />
            {modal && (
                <Modal title={modal === 'create' ? 'Новий курс' : 'Редагувати курс'} onClose={() => setModal(null)}>
                    <div className="space-y-4">
                        <ImageUpload label="Зображення" value={form.image} onChange={f => setForm(p => ({ ...p, image: f }))} preview={editItem?.image}/>
                        <Input label="Назва" value={form.title} onChange={v => setForm(p => ({ ...p, title: v }))} required placeholder="Назва курсу"/>
                        <Input label="Slug (URL)" value={form.slug} onChange={v => setForm(p => ({ ...p, slug: v }))} placeholder="автозаповнення"/>
                        <Textarea label="Опис" value={form.description} onChange={v => setForm(p => ({ ...p, description: v }))} rows={4}/>
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Ціна (₴)" value={form.price} onChange={v => setForm(p => ({ ...p, price: v }))} type="number" placeholder="1500"/>
                            <SelectField label="Категорія" value={form.category} onChange={v => setForm(p => ({ ...p, category: v }))} options={catOptions}/>
                        </div>
                        <MultiSelect label="Вчителі" options={teacherOptions} selected={form.teacherIds} onChange={ids => setForm(p => ({ ...p, teacherIds: ids }))}/>
                        {error && <p className="text-red-500 dark:text-rose-400 text-sm">{error}</p>}
                        <SaveButton loading={creating || updating} onClick={handleSave}/>
                    </div>
                </Modal>
            )}
            {deleteTarget && (
                <ConfirmModal title="Видалити курс?" body={`"${deleteTarget.title}" та всі пов'язані дані.`}
                              onConfirm={async () => { await deleteCourse(deleteTarget.slug); setDeleteTarget(null); }}
                              onCancel={() => setDeleteTarget(null)}
                />
            )}
        </div>
    );
}

// ─── NEWS ─────────────────────────────────────────────────────────────────────

function NewsSection() {
    const { data: news = [], isLoading } = useGetNewsQuery();
    const [createNews, { isLoading: creating }] = useCreateNewsMutation();
    const [updateNews, { isLoading: updating }] = useUpdateNewsMutation();
    const [deleteNews] = useDeleteNewsMutation();

    type FormState = { title: string; content: string; image: File | null };
    const emptyForm: FormState = { title: '', content: '', image: null };
    const [modal, setModal] = useState<null | 'create' | 'edit'>(null);
    const [editItem, setEditItem] = useState<any>(null);
    const [form, setForm] = useState<FormState>(emptyForm);
    const [deleteTarget, setDeleteTarget] = useState<any>(null);
    const [error, setError] = useState('');

    const openCreate = () => { setForm(emptyForm); setEditItem(null); setError(''); setModal('create'); };
    const openEdit = (item: any) => {
        setForm({ title: item.title, content: item.content || '', image: null });
        setEditItem(item); setError(''); setModal('edit');
    };

    const buildFD = () => {
        const fd = new FormData();
        fd.append('title', form.title);
        fd.append('content', form.content);
        if (form.image) fd.append('image', form.image);
        return fd;
    };

    const handleSave = async () => {
        if (!form.title.trim()) { setError('Назва обов\'язкова'); return; }
        try {
            if (modal === 'create') await createNews(buildFD() as any).unwrap();
            else await updateNews({ id: editItem.id, data: buildFD() as any }).unwrap();
            setModal(null);
        } catch { setError('Помилка збереження'); }
    };

    return (
        <div className="space-y-4">
            <SectionHeader title="Новини" subtitle={`${news.length} публікацій`} onAdd={openCreate} addLabel="Додати новину" addColor="bg-sky-600 hover:bg-sky-500"/>
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden">
                            <div className="h-40 bg-gray-200 dark:bg-slate-800"/>
                            <div className="p-4 space-y-2"><div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-3/4"/></div>
                        </div>
                    ))}
                </div>
            ) : news.length === 0 ? <EmptyState label="Новин ще немає"/> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {news.map(item => (
                        <div key={item.id} className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden hover:border-gray-300 dark:hover:border-slate-700 transition-colors">
                            <div className="relative h-40 bg-gray-100 dark:bg-slate-800 overflow-hidden">
                                {mediaUrl(item.image)
                                    ? <img src={mediaUrl(item.image)!} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                                    : <div className="w-full h-full flex items-center justify-center text-4xl">📰</div>
                                }
                            </div>
                            <div className="p-4">
                                <p className="font-bold text-gray-900 dark:text-white text-sm line-clamp-2 mb-1.5">{item.title}</p>
                                <p className="text-xs text-gray-400 dark:text-gray-400">{new Date(item.created_at).toLocaleDateString('uk-UA')}</p>
                                <div className="flex gap-2 mt-3">
                                    <button onClick={() => openEdit(item)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg text-xs font-bold transition-colors">
                                        <Pencil size={12}/> Редагувати
                                    </button>
                                    <button onClick={() => setDeleteTarget(item)} className="p-1.5 bg-gray-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-rose-500/10 text-gray-400 dark:text-gray-300 hover:text-red-500 dark:hover:text-rose-400 rounded-lg transition-colors">
                                        <Trash2 size={14}/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {modal && (
                <Modal title={modal === 'create' ? 'Нова новина' : 'Редагувати новину'} onClose={() => setModal(null)}>
                    <div className="space-y-4">
                        <ImageUpload label="Зображення" value={form.image} onChange={f => setForm(p => ({ ...p, image: f }))} preview={editItem?.image}/>
                        <Input label="Заголовок" value={form.title} onChange={v => setForm(p => ({ ...p, title: v }))} required/>
                        <Textarea label="Текст" value={form.content} onChange={v => setForm(p => ({ ...p, content: v }))} rows={6}/>
                        {error && <p className="text-red-500 dark:text-rose-400 text-sm">{error}</p>}
                        <SaveButton loading={creating || updating} onClick={handleSave}/>
                    </div>
                </Modal>
            )}
            {deleteTarget && (
                <ConfirmModal title="Видалити новину?" body={`"${deleteTarget.title}"`}
                              onConfirm={async () => { await deleteNews(deleteTarget.id); setDeleteTarget(null); }}
                              onCancel={() => setDeleteTarget(null)}
                />
            )}
        </div>
    );
}

// ─── PROMOTIONS ───────────────────────────────────────────────────────────────

function PromotionsSection() {
    const { data: promotions = [], isLoading } = useGetPromotionsQuery();
    const [createPromotion, { isLoading: creating }] = useCreatePromotionMutation();
    const [updatePromotion, { isLoading: updating }] = useUpdatePromotionMutation();
    const [deletePromotion] = useDeletePromotionMutation();

    type FormState = { title: string; description: string; discount: string; valid_until: string; image: File | null };
    const emptyForm: FormState = { title: '', description: '', discount: '', valid_until: '', image: null };
    const [modal, setModal] = useState<null | 'create' | 'edit'>(null);
    const [editItem, setEditItem] = useState<any>(null);
    const [form, setForm] = useState<FormState>(emptyForm);
    const [deleteTarget, setDeleteTarget] = useState<any>(null);
    const [error, setError] = useState('');

    const openCreate = () => { setForm(emptyForm); setEditItem(null); setError(''); setModal('create'); };
    const openEdit = (item: any) => {
        setForm({ title: item.title, description: item.description || '', discount: item.discount || '', valid_until: item.valid_until?.split('T')[0] || '', image: null });
        setEditItem(item); setError(''); setModal('edit');
    };

    const buildFD = () => {
        const fd = new FormData();
        fd.append('title', form.title);
        fd.append('description', form.description);
        fd.append('discount', form.discount);
        if (form.valid_until) fd.append('valid_until', form.valid_until);
        if (form.image) fd.append('image', form.image);
        return fd;
    };

    const handleSave = async () => {
        if (!form.title.trim()) { setError('Назва обов\'язкова'); return; }
        try {
            if (modal === 'create') await createPromotion(buildFD() as any).unwrap();
            else await updatePromotion({ id: editItem.id, data: buildFD() as any }).unwrap();
            setModal(null);
        } catch { setError('Помилка збереження'); }
    };

    return (
        <div className="space-y-4">
            <SectionHeader title="Акції" subtitle={`${promotions.length} акцій`} onAdd={openCreate} addLabel="Додати акцію" addColor="bg-amber-500 hover:bg-amber-400"/>
            {isLoading
                ? <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{Array(2).fill(0).map((_, i) => <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-slate-700 h-36 rounded-2xl"/>)}</div>
                : promotions.length === 0 ? <EmptyState label="Акцій ще немає"/>
                    : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {promotions.map(promo => (
                                <div key={promo.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 flex gap-4 hover:border-gray-300 dark:hover:border-slate-700 transition-colors">
                                    <div className="w-16 h-16 rounded-xl bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                        {mediaUrl(promo.image)
                                            ? <img src={mediaUrl(promo.image)!} alt="" className="w-full h-full object-cover rounded-xl"/>
                                            : <Tag size={22} className="text-amber-500 dark:text-amber-400"/>
                                        }
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <p className="font-bold text-gray-900 dark:text-white text-sm">{promo.title}</p>
                                            {promo.discount && (
                                                <span className="bg-amber-400 dark:bg-amber-500 text-gray-900 dark:text-gray-950 text-xs font-black px-2 py-0.5 rounded-lg flex-shrink-0">
                                                    -{promo.discount}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-300 line-clamp-2">{promo.description}</p>
                                        {promo.valid_until && (
                                            <p className="text-xs text-gray-400 dark:text-gray-400 mt-2 flex items-center gap-1">
                                                <Calendar size={10}/> До {new Date(promo.valid_until).toLocaleDateString('uk-UA')}
                                            </p>
                                        )}
                                        <div className="flex gap-2 mt-3">
                                            <button onClick={() => openEdit(promo)} className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg text-xs font-bold transition-colors">
                                                <Pencil size={11}/> Редагувати
                                            </button>
                                            <button onClick={() => setDeleteTarget(promo)} className="p-1 bg-gray-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-rose-500/10 text-gray-400 dark:text-gray-300 hover:text-red-500 dark:hover:text-rose-400 rounded-lg transition-colors">
                                                <Trash2 size={13}/>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
            }
            {modal && (
                <Modal title={modal === 'create' ? 'Нова акція' : 'Редагувати акцію'} onClose={() => setModal(null)}>
                    <div className="space-y-4">
                        <ImageUpload label="Зображення" value={form.image} onChange={f => setForm(p => ({ ...p, image: f }))} preview={editItem?.image}/>
                        <Input label="Назва" value={form.title} onChange={v => setForm(p => ({ ...p, title: v }))} required/>
                        <Textarea label="Опис" value={form.description} onChange={v => setForm(p => ({ ...p, description: v }))} rows={3}/>
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Знижка" value={form.discount} onChange={v => setForm(p => ({ ...p, discount: v }))} placeholder="20% або 500₴"/>
                            <Input label="Діє до" value={form.valid_until} onChange={v => setForm(p => ({ ...p, valid_until: v }))} type="date"/>
                        </div>
                        {error && <p className="text-red-500 dark:text-rose-400 text-sm">{error}</p>}
                        <SaveButton loading={creating || updating} onClick={handleSave}/>
                    </div>
                </Modal>
            )}
            {deleteTarget && (
                <ConfirmModal title="Видалити акцію?" body={`"${deleteTarget.title}"`}
                              onConfirm={async () => { await deletePromotion(deleteTarget.id); setDeleteTarget(null); }}
                              onCancel={() => setDeleteTarget(null)}
                />
            )}
        </div>
    );
}

// ─── REVIEWS ──────────────────────────────────────────────────────────────────

function ReviewsSection() {
    const { data: reviews = [], isLoading } = useGetReviewsQuery();
    const [togglePublish] = useToggleReviewPublishMutation();
    const [deleteReview] = useDeleteReviewMutation();
    const [filter, setFilter] = useState<'all' | 'course' | 'school'>('all');
    const [deleteTarget, setDeleteTarget] = useState<any>(null);

    const filtered = filter === 'all' ? reviews : reviews.filter(r => r.review_type === filter);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white">Відгуки</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{reviews.length} відгуків</p>
                </div>
                <div className="flex gap-1 bg-gray-100 dark:bg-slate-800 p-1 rounded-xl border border-gray-200 dark:border-slate-700">
                    {(['all', 'course', 'school'] as const).map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === f ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200'}`}>
                            {f === 'all' ? 'Всі' : f === 'course' ? 'На курс' : 'Про школу'}
                        </button>
                    ))}
                </div>
            </div>
            {isLoading
                ? <div className="space-y-3">{Array(4).fill(0).map((_, i) => <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-900 h-20 rounded-2xl border border-gray-200 dark:border-slate-700"/>)}</div>
                : filtered.length === 0 ? <EmptyState label="Відгуків немає"/>
                    : (
                        <div className="space-y-3">
                            {filtered.map((r: any) => {
                                const name = r.user.first_name ? `${r.user.first_name} ${r.user.last_name || ''}`.trim() : r.user.username;
                                return (
                                    <div key={r.id} className={`bg-white dark:bg-gray-900 rounded-2xl border p-4 flex gap-4 transition-colors ${r.is_published !== false ? 'border-gray-200 dark:border-slate-700' : 'border-gray-100 dark:border-slate-700 opacity-60'}`}>
                                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/15 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-black flex-shrink-0">
                                            {name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-bold text-gray-900 dark:text-white text-sm">{name}</span>
                                                    <Badge color={r.review_type === 'school' ? 'violet' : 'blue'}>{r.review_type === 'school' ? 'Школа' : 'Курс'}</Badge>
                                                    {r.is_published === false && <Badge color="slate">Приховано</Badge>}
                                                </div>
                                                <div className="flex gap-0.5">{[1,2,3,4,5].map(i => <Star key={i} size={12} className={i <= r.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 dark:text-gray-700'}/>)}</div>
                                            </div>
                                            <p className="text-sm text-gray-500 dark:text-gray-300 line-clamp-2 mb-2">{r.comment}</p>
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <span className="text-xs text-gray-400 dark:text-gray-500">{new Date(r.created_at).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                                <button onClick={() => togglePublish(r.id)}
                                                        className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-lg transition-colors ${r.is_published !== false ? 'text-gray-400 dark:text-gray-300 hover:text-red-500 dark:hover:text-rose-400 hover:bg-red-50 dark:hover:bg-rose-500/10' : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'}`}>
                                                    {r.is_published !== false ? <><X size={11}/> Приховати</> : <><Check size={11}/> Опублікувати</>}
                                                </button>
                                                <button onClick={() => setDeleteTarget(r)} className="flex items-center gap-1 text-xs font-bold text-gray-400 dark:text-gray-400 hover:text-red-500 dark:hover:text-rose-400 hover:bg-red-50 dark:hover:bg-rose-500/10 px-2 py-0.5 rounded-lg transition-colors">
                                                    <Trash2 size={11}/> Видалити
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )
            }
            {deleteTarget && (
                <ConfirmModal title="Видалити відгук?" body={`Відгук від ${deleteTarget.user.first_name || deleteTarget.user.username}.`}
                              onConfirm={async () => { await deleteReview(deleteTarget.id); setDeleteTarget(null); }}
                              onCancel={() => setDeleteTarget(null)}
                />
            )}
        </div>
    );
}

// ─── TRIALS ───────────────────────────────────────────────────────────────────

function TrialsSection() {
    const { data: trials = [], isLoading } = useGetTrialLessonsQuery();
    const [setStatus] = useSetTrialStatusMutation();
    const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'processed'>('all');

    const allTrials = trials as any[];
    const filtered = statusFilter === 'all' ? allTrials : allTrials.filter(t => t.status === statusFilter);
    const newCount = allTrials.filter(t => t.status === 'new').length;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                        Заявки на урок
                        {newCount > 0 && <span className="bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded-full animate-pulse">{newCount}</span>}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{allTrials.length} заявок</p>
                </div>
                <div className="flex gap-1 bg-gray-100 dark:bg-slate-800 p-1 rounded-xl border border-gray-200 dark:border-slate-700">
                    {(['all', 'new', 'processed'] as const).map(f => (
                        <button key={f} onClick={() => setStatusFilter(f)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === f ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200'}`}>
                            {f === 'all' ? 'Всі' : f === 'new' ? 'Нові' : 'Оброблені'}
                        </button>
                    ))}
                </div>
            </div>
            {isLoading
                ? <div className="space-y-3">{Array(4).fill(0).map((_, i) => <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-900 h-20 rounded-2xl border border-gray-200 dark:border-slate-700"/>)}</div>
                : filtered.length === 0 ? <EmptyState label={statusFilter === 'new' ? 'Нових заявок немає' : 'Заявок немає'}/>
                    : (
                        <div className="space-y-3">
                            {filtered.map((trial: any) => (
                                <div key={trial.id} className={`bg-white dark:bg-gray-900 rounded-2xl border p-4 flex items-center gap-4 transition-all ${trial.status === 'new' ? 'border-red-200 dark:border-rose-500/30' : 'border-gray-200 dark:border-slate-700'}`}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${trial.status === 'new' ? 'bg-red-100 dark:bg-rose-500/10 border border-red-200 dark:border-rose-500/20' : 'bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20'}`}>
                                        {trial.status === 'new'
                                            ? <Phone size={17} className="text-red-500 dark:text-rose-400"/>
                                            : <Check size={17} className="text-emerald-600 dark:text-emerald-400"/>
                                        }
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <span className="font-bold text-gray-900 dark:text-white text-sm">{trial.full_name}</span>
                                            <Badge color={trial.status === 'new' ? 'rose' : 'emerald'}>{trial.status === 'new' ? 'Нова' : 'Оброблено'}</Badge>
                                        </div>
                                        <div className="flex items-center gap-4 flex-wrap">
                                            <span className="text-xs text-gray-400 dark:text-gray-400 flex items-center gap-1"><Phone size={10}/> {trial.phone}</span>
                                            {trial.child_age && <span className="text-xs text-gray-400 dark:text-gray-400">Вік: {trial.child_age}</span>}
                                            <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1"><Calendar size={10}/> {new Date(trial.created_at).toLocaleDateString('uk-UA')}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setStatus({ id: trial.id, status: trial.status === 'new' ? 'processed' : 'new' })}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex-shrink-0 ${trial.status === 'new' ? 'bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-500/20' : 'bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}>
                                        {trial.status === 'new' ? <><Check size={12}/> Оброблено</> : <><Phone size={12}/> Нова</>}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )
            }
        </div>
    );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function AdminPanelPage() {
    const { user } = useSelector((state: RootState) => state.auth);
    const [section, setSection] = useState<Section>('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { data: trials = [] } = useGetTrialLessonsQuery();
    const newTrialsCount = (trials as any[]).filter((t: any) => t.status === 'new').length;
    const currentNav = navItems.find(n => n.id === section)!;

    const renderSection = () => {
        switch (section) {
            case 'dashboard':  return <DashboardSection/>;
            case 'courses':    return <CoursesSection/>;
            case 'teachers':   return <TeachersSection/>;
            case 'students':   return <StudentsSection/>;
            case 'news':       return <NewsSection/>;
            case 'promotions': return <PromotionsSection/>;
            case 'reviews':    return <ReviewsSection/>;
            case 'trials':     return <TrialsSection/>;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">

            {/* Overlay для мобільного меню */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ── Sidebar ── */}
            <aside className={`
                fixed md:sticky top-0 left-0 h-screen z-50 md:z-auto
                w-60 bg-white dark:bg-gray-900
                border-r border-gray-200 dark:border-slate-700
                flex flex-col transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                {/* Logo */}
                <div className="px-5 py-5 border-b border-gray-100 dark:border-slate-700 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                            <LayoutDashboard size={15} className="text-white"/>
                        </div>
                        <div className="min-w-0">
                            <p className="font-black text-gray-900 dark:text-white text-sm tracking-tight">
                                MARYCO <span className="text-blue-500">ADMIN</span>
                            </p>
                            <p className="text-[11px] text-gray-400 dark:text-gray-400 truncate">{user?.first_name || user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
                    {navItems.map(item => {
                        const isActive = section === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => { setSection(item.id); setSidebarOpen(false); }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all relative ${
                                    isActive
                                        ? 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-white'
                                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-gray-300'
                                }`}
                            >
                                <span className={isActive ? 'text-blue-500' : item.color}>{item.icon}</span>
                                <span className="flex-1 text-left">{item.label}</span>
                                {item.id === 'trials' && newTrialsCount > 0 && (
                                    <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                        {newTrialsCount}
                                    </span>
                                )}
                                {isActive && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-500 rounded-l-full"/>}
                            </button>
                        );
                    })}
                </nav>

                {/* User */}
                <div className="p-3 border-t border-gray-100 dark:border-slate-700 flex-shrink-0">
                    <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-slate-800">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                            {(user?.first_name || user?.email || 'A').charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate">{user?.first_name || user?.username || 'Admin'}</p>
                            <p className="text-[10px] text-gray-400 dark:text-gray-400 truncate">{user?.email}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* ── Main ── */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Topbar */}
                <header className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-gray-200 dark:border-slate-700 px-4 md:px-6 py-3.5 flex items-center gap-3">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        aria-label="Відкрити меню"
                        className="md:hidden p-1.5 rounded-lg text-gray-400 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    >
                        {sidebarOpen ? <X size={18}/> : <ChevronLeft size={18} className="rotate-180"/>}
                    </button>
                    <div className="flex items-center gap-2">
                        <span className={currentNav.color}>{currentNav.icon}</span>
                        <h1 className="font-black text-gray-900 dark:text-white text-base">{currentNav.label}</h1>
                    </div>
                    <div className="ml-auto">
                        <span className="text-xs font-bold text-gray-400 dark:text-gray-300 bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-lg border border-gray-200 dark:border-slate-700">
                            {currentNav.label}
                        </span>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 p-4 md:p-6 max-w-6xl w-full mx-auto">
                    {renderSection()}
                </main>
            </div>
        </div>
    );
}