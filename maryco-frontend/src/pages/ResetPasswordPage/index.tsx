// maryco-frontend/src/pages/ResetPasswordPage/index.tsx
import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useResetPasswordConfirmMutation } from '../../services/marycoApi';
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token') || '';

    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [clientError, setClientError] = useState('');

    const [resetPassword, { isLoading, isSuccess, error }] = useResetPasswordConfirmMutation();

    // Витягуємо зрозуміле повідомлення про помилку з відповіді сервера
    const serverErrorMsg = (() => {
        if (!error) return '';
        const data = (error as any)?.data;
        if (!data) return 'Токен недійсний або термін його дії закінчився.';
        if (typeof data === 'string') return data;
        // django-rest-passwordreset повертає { "password": [...] } або { "token": [...] }
        if (data.password) return Array.isArray(data.password) ? data.password[0] : data.password;
        if (data.token) return 'Токен недійсний або термін його дії закінчився.';
        if (data.detail) return data.detail;
        if (data.non_field_errors) return data.non_field_errors[0];
        return JSON.stringify(data);
    })();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setClientError('');

        if (!token) {
            setClientError('Токен відсутній. Перейдіть за посиланням з листа.');
            return;
        }

        if (password.length < 8) {
            setClientError('Пароль повинен містити мінімум 8 символів.');
            return;
        }

        if (password !== passwordConfirm) {
            setClientError('Паролі не співпадають.');
            return;
        }

        try {
            await resetPassword({ token, password }).unwrap();
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            // помилка відображається через serverErrorMsg
            console.error('Reset password error:', err);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 px-4">
                <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 dark:border-slate-800 text-center">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">⚠️</div>
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">Невірне посилання</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Токен відсутній у посиланні. Перейдіть за посиланням з листа або запросіть нове.
                    </p>
                    <Link
                        to="/forgot-password"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition-colors"
                    >
                        Запросити нове посилання
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 px-4">
            <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 dark:border-slate-800">

                <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 mb-6 transition-colors"
                >
                    <ArrowLeft size={16} /> Назад до входу
                </Link>

                {isSuccess ? (
                    <div className="text-center py-4">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 size={40} className="text-green-500 dark:text-green-400" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                            Пароль змінено!
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400">
                            Зараз ви будете перенаправлені на сторінку входу...
                        </p>
                        <Link
                            to="/login"
                            className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition-colors"
                        >
                            Увійти зараз
                        </Link>
                    </div>
                ) : (
                    <>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Новий пароль</h1>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">
                            Введіть новий пароль для вашого акаунту Maryco Club.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Поле пароль */}
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1">
                                    Новий пароль
                                </label>
                                <div className="relative">
                                    <Lock
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                        size={18}
                                    />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        minLength={8}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none dark:text-white transition-all"
                                        placeholder="Мінімум 8 символів"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Підтвердження пароля */}
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1">
                                    Підтвердіть пароль
                                </label>
                                <div className="relative">
                                    <Lock
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                        size={18}
                                    />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={passwordConfirm}
                                        onChange={(e) => setPasswordConfirm(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none dark:text-white transition-all"
                                        placeholder="Повторіть пароль"
                                    />
                                </div>
                            </div>

                            {/* Помилки */}
                            {(clientError || serverErrorMsg) && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-bold">
                                    {clientError || serverErrorMsg}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Оновлення...
                                    </span>
                                ) : (
                                    'Зберегти новий пароль'
                                )}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}