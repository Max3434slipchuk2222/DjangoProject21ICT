import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useResetPasswordConfirmMutation } from '../../services/marycoApi';
import { Lock, Eye, EyeOff } from 'lucide-react';

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token') || '';

    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [resetPassword, { isLoading, isSuccess, error }] = useResetPasswordConfirmMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await resetPassword({ token, password }).unwrap();
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 px-4">
            <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 dark:border-slate-800">
                {isSuccess ? (
                    <div className="text-center">
                        <h2 className="text-2xl font-black text-green-600 mb-2">Пароль змінено!</h2>
                        <p className="text-gray-500">Зараз ви будете перенаправлені на сторінку входу...</p>
                    </div>
                ) : (
                    <>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-6">Новий пароль</h1>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Введіть новий пароль</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 dark:text-white"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {error && <p className="text-red-500 text-xs mt-2">Токен недійсний або термін його дії закінчився</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || !token}
                                className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg transition-all disabled:opacity-50"
                            >
                                {isLoading ? 'Оновлення...' : 'Зберегти новий пароль'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}