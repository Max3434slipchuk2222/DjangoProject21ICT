import React, { useState } from 'react';
import { useLoginMutation } from '../../services/marycoApi';
import { useDispatch } from 'react-redux';
import { setCredentials, setUser } from '../../store/slices/authSlice';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const [login, { isLoading }] = useLoginMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // Куди повертати після логіну (якщо прийшов з захищеної сторінки)
    const from = (location.state as { from?: Location })?.from?.pathname || '/';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        try {
            // 1. Отримуємо токени
            const tokens = await login({ email, password }).unwrap();
            dispatch(setCredentials(tokens));

            // 2. Отримуємо профіль юзера через /me/
            // Використовуємо fetch напряму щоб уникнути проблем з кешем RTK Query
            const meRes = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/auth/me/`,
                { headers: { Authorization: `Bearer ${tokens.access}` } }
            );
            if (meRes.ok) {
                const userData = await meRes.json();
                dispatch(setUser(userData));
            }

            // 3. Повертаємо туди звідки прийшов
            navigate(from, { replace: true });
        } catch {
            setErrorMsg('Неправильний email або пароль');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 dark:bg-slate-950 px-4 transition-colors">
            <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-10 shadow-2xl border border-gray-100 dark:border-slate-800 relative">
                <Link
                    to="/"
                    className="absolute top-6 left-6 p-2 rounded-full bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-gray-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-all group"
                >
                    <ArrowLeft size={20} strokeWidth={2.5} className="group-hover:-translate-x-1 transition-transform" />
                </Link>

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white">З поверненням!</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Увійдіть до Maryco Club</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                            placeholder="example@mail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Пароль</label>
                        <input
                            type="password"
                            required
                            className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {errorMsg && (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-bold text-center">
                            {errorMsg}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                        {isLoading ? 'Вхід...' : 'Увійти в кабінет'}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                        Немає акаунту?{' '}
                        <Link to="/register" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                            Зареєструватися
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}