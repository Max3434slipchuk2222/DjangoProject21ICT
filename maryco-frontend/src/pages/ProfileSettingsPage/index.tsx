import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { setUser } from '../../store/slices/authSlice';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { useUpdateUserProfileMutation, useChangePasswordMutation } from '../../services/marycoApi';

// ─── Типи ────────────────────────────────────────────────────────────────────
type Tab = 'profile' | 'password';

interface FieldState {
    value: string;
    status: 'idle' | 'loading' | 'success' | 'error';
    message: string;
}

const initField = (value: string): FieldState => ({ value, status: 'idle', message: '' });

// ─── Маленький компонент статусу поля ────────────────────────────────────────
function FieldStatus({ status, message }: { status: FieldState['status']; message: string }) {
    if (status === 'idle' || !message) return null;
    if (status === 'loading') return null;
    return (
        <p className={`mt-1.5 text-xs font-bold flex items-center gap-1 ${status === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
            {status === 'success' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
            {message}
        </p>
    );
}

// ─── Головний компонент ───────────────────────────────────────────────────────
export default function ProfileSettingsPage() {
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();

    // Використовуємо наші нові хуки замість fetch
    const [updateProfile] = useUpdateUserProfileMutation();
    const [changePassword] = useChangePasswordMutation();

    const [activeTab, setActiveTab] = useState<Tab>('profile');
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Поля профілю
    const [firstName, setFirstName] = useState<FieldState>(initField(user?.first_name || ''));
    const [lastName, setLastName]   = useState<FieldState>(initField(user?.last_name || ''));

    // Поля пароля
    const [oldPassword, setOldPassword]         = useState('');
    const [newPassword, setNewPassword]         = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [pwStatus, setPwStatus] = useState<{ status: FieldState['status']; message: string }>({ status: 'idle', message: '' });

    // ── Зберегти ім'я ──────────────────────────────────────────────────────
    const saveField = async (field: 'first_name' | 'last_name', value: string, set: React.Dispatch<React.SetStateAction<FieldState>>) => {
        if (!value.trim()) {
            set(prev => ({ ...prev, status: 'error', message: "Поле не може бути порожнім" }));
            return;
        }
        set(prev => ({ ...prev, status: 'loading', message: '' }));
        try {
            // Виконуємо запит
            const updatedUser = await updateProfile({ [field]: value }).unwrap();

            // ПЕРЕВІРКА: чи справді бекенд повернув оновлене значення?
            if (updatedUser[field] !== value) {
                throw new Error("Бекенд не зберіг зміни. Перевірте MeView у Django.");
            }

            dispatch(setUser(updatedUser));
            set(prev => ({ ...prev, status: 'success', message: 'Збережено в базі!' }));
            setTimeout(() => set(prev => ({ ...prev, status: 'idle', message: '' })), 3000);
        } catch (err: any) {
            console.error('Save error:', err);
            const msg = err?.status === 405
                ? "Метод PATCH не дозволено. Змініть MeView на RetrieveUpdateAPIView"
                : (err.message || 'Помилка збереження');
            set(prev => ({ ...prev, status: 'error', message: msg }));
        }
    };


    // ── Змінити пароль ─────────────────────────────────────────────────────
    const savePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPwStatus({ status: 'idle', message: '' });

        if (newPassword.length < 8) {
            setPwStatus({ status: 'error', message: 'Новий пароль — мінімум 8 символів' });
            return;
        }
        if (newPassword !== confirmPassword) {
            setPwStatus({ status: 'error', message: 'Паролі не співпадають' });
            return;
        }
        if (oldPassword === newPassword) {
            setPwStatus({ status: 'error', message: 'Новий пароль не може збігатися зі старим' });
            return;
        }

        setPwStatus({ status: 'loading', message: '' });

        try {
            // Викликаємо мутацію зміни пароля
            await changePassword({
                old_password: oldPassword,
                new_password1: newPassword,
                new_password2: confirmPassword
            }).unwrap();

            setPwStatus({ status: 'success', message: 'Пароль успішно змінено!' });
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            const msg = err?.data?.detail || err?.data?.old_password?.[0] || 'Помилка зміни пароля';
            setPwStatus({ status: 'error', message: msg });
        }
    };

    const displayName = user?.first_name
        ? `${user.first_name} ${user.last_name || ''}`.trim()
        : user?.username || 'Користувач';
    const avatarLetter = (user?.first_name || user?.username || 'U').charAt(0).toUpperCase();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-10 px-4 transition-colors">
            <div className="max-w-2xl mx-auto">

                {/* Навігація назад */}
                <Link
                    to="/profile"
                    className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-colors group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Назад до профілю
                </Link>

                {/* Заголовок */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 font-black text-xl">
                        {avatarLetter}
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Налаштування</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{displayName}</p>
                    </div>
                </div>

                {/* Таби */}
                <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-2xl gap-1 mb-8 w-fit">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                            activeTab === 'profile'
                                ? 'bg-white dark:bg-slate-900 text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                        }`}
                    >
                        <User size={15} /> Профіль
                    </button>
                    <button
                        onClick={() => setActiveTab('password')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                            activeTab === 'password'
                                ? 'bg-white dark:bg-slate-900 text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                        }`}
                    >
                        <Lock size={15} /> Пароль
                    </button>
                </div>

                {/* ── ТАБ: ПРОФІЛЬ ─────────────────────────────────────────────── */}
                {activeTab === 'profile' && (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-100 dark:border-slate-800 shadow-sm space-y-6">
                        <h2 className="text-lg font-black text-gray-900 dark:text-white">Особисті дані</h2>

                        {/* Email (тільки читання) */}
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                                Email
                            </label>
                            <div className="flex items-center gap-3 px-5 py-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
                                <span className="text-gray-900 dark:text-white font-medium flex-1">{user?.email}</span>
                                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded-lg">
                                    не змінюється
                                </span>
                            </div>
                        </div>

                        {/* Ім'я */}
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                                Ім'я
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={firstName.value}
                                    onChange={e => setFirstName(prev => ({ ...prev, value: e.target.value, status: 'idle', message: '' }))}
                                    className="flex-1 px-5 py-4 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all font-medium"
                                    placeholder="Ваше ім'я"
                                />
                                <button
                                    onClick={() => saveField('first_name', firstName.value, setFirstName)}
                                    disabled={firstName.status === 'loading'}
                                    className="px-5 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all disabled:opacity-50 whitespace-nowrap text-sm"
                                >
                                    {firstName.status === 'loading' ? '...' : 'Зберегти'}
                                </button>
                            </div>
                            <FieldStatus status={firstName.status} message={firstName.message} />
                        </div>

                        {/* Прізвище */}
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                                Прізвище
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={lastName.value}
                                    onChange={e => setLastName(prev => ({ ...prev, value: e.target.value, status: 'idle', message: '' }))}
                                    className="flex-1 px-5 py-4 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all font-medium"
                                    placeholder="Ваше прізвище"
                                />
                                <button
                                    onClick={() => saveField('last_name', lastName.value, setLastName)}
                                    disabled={lastName.status === 'loading'}
                                    className="px-5 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all disabled:opacity-50 whitespace-nowrap text-sm"
                                >
                                    {lastName.status === 'loading' ? '...' : 'Зберегти'}
                                </button>
                            </div>
                            <FieldStatus status={lastName.status} message={lastName.message} />
                        </div>

                        {/* Роль (тільки читання) */}
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                                Роль
                            </label>
                            <div className="px-5 py-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
                                <span className={`inline-block text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                                    user?.role === 'admin'
                                        ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                                        : user?.role === 'teacher'
                                            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                }`}>
                                    {user?.role === 'admin' ? 'Адміністратор' : user?.role === 'teacher' ? 'Вчитель' : 'Користувач'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── ТАБ: ПАРОЛЬ ──────────────────────────────────────────────── */}
                {activeTab === 'password' && (
                    <form
                        onSubmit={savePassword}
                        className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-100 dark:border-slate-800 shadow-sm space-y-5"
                    >
                        <h2 className="text-lg font-black text-gray-900 dark:text-white">Зміна пароля</h2>

                        {/* Поточний пароль */}
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                                Поточний пароль
                            </label>
                            <div className="relative">
                                <input
                                    type={showOld ? 'text' : 'password'}
                                    required
                                    value={oldPassword}
                                    onChange={e => setOldPassword(e.target.value)}
                                    className="w-full pl-5 pr-12 py-4 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all font-medium"
                                    placeholder="Введіть поточний пароль"
                                />
                                <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500">
                                    {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Новий пароль */}
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                                Новий пароль
                            </label>
                            <div className="relative">
                                <input
                                    type={showNew ? 'text' : 'password'}
                                    required
                                    minLength={8}
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    className="w-full pl-5 pr-12 py-4 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all font-medium"
                                    placeholder="Мінімум 8 символів"
                                />
                                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500">
                                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {/* Індикатор сили пароля */}
                            {newPassword.length > 0 && (
                                <div className="mt-2 flex gap-1.5">
                                    {[1, 2, 3, 4].map(i => (
                                        <div
                                            key={i}
                                            className={`h-1 flex-1 rounded-full transition-colors ${
                                                newPassword.length >= i * 3
                                                    ? newPassword.length >= 12 ? 'bg-green-500'
                                                        : newPassword.length >= 9 ? 'bg-yellow-500'
                                                            : 'bg-red-400'
                                                    : 'bg-gray-200 dark:bg-slate-700'
                                            }`}
                                        />
                                    ))}
                                    <span className="text-xs text-gray-400 ml-1">
                                        {newPassword.length < 8 ? 'Слабкий' : newPassword.length < 12 ? 'Нормальний' : 'Надійний'}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Підтвердити пароль */}
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                                Підтвердіть новий пароль
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirm ? 'text' : 'password'}
                                    required
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    className={`w-full pl-5 pr-12 py-4 bg-gray-50 dark:bg-slate-800 border rounded-2xl text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all font-medium ${
                                        confirmPassword && confirmPassword !== newPassword
                                            ? 'border-red-300 dark:border-red-700'
                                            : 'border-gray-100 dark:border-slate-700'
                                    }`}
                                    placeholder="Повторіть новий пароль"
                                />
                                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500">
                                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {confirmPassword && confirmPassword !== newPassword && (
                                <p className="mt-1.5 text-xs font-bold text-red-500 flex items-center gap-1">
                                    <AlertCircle size={12} /> Паролі не співпадають
                                </p>
                            )}
                        </div>

                        {/* Статус */}
                        {pwStatus.message && (
                            <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-2 ${
                                pwStatus.status === 'success'
                                    ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-900/30'
                                    : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30'
                            }`}>
                                {pwStatus.status === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                {pwStatus.message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={pwStatus.status === 'loading'}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                            {pwStatus.status === 'loading' ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Збереження...
                                </span>
                            ) : 'Змінити пароль'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}