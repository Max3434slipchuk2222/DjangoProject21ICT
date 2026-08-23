import React, { useState } from 'react';
import { useRegisterMutation } from '../../services/marycoApi';
import { useDispatch } from 'react-redux';
import { setCredentials, setUser } from '../../store/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from "lucide-react";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        password_confirm: '',
    });
    const [errorMsg, setErrorMsg] = useState('');

    const [register, { isLoading }] = useRegisterMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        if (formData.password !== formData.password_confirm) {
            setErrorMsg('Паролі не співпадають');
            return;
        }

        try {
            // Бекенд RegisterSerializer очікує: email, first_name, password, password_confirm
            const tokens = await register({
                email: formData.email,
                first_name: formData.first_name,
                password: formData.password,
                password_confirm: formData.password_confirm,
            } as any).unwrap();

            dispatch(setCredentials(tokens));

            // Отримуємо профіль після реєстрації
            const meRes = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/auth/me/`,
                { headers: { Authorization: `Bearer ${tokens.access}` } }
            );
            if (meRes.ok) {
                const userData = await meRes.json();
                dispatch(setUser(userData));
            }

            navigate('/profile');
        } catch (err: any) {
            const data = err?.data;
            if (data?.email) {
                setErrorMsg(`Email: ${data.email[0]}`);
            } else if (data?.password) {
                setErrorMsg(`Пароль: ${data.password[0]}`);
            } else if (data?.detail) {
                setErrorMsg(data.detail);
            } else {
                setErrorMsg('Помилка реєстрації. Спробуйте ще раз.');
            }
        }
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 transition-colors">
            <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-10 shadow-2xl border border-gray-100 dark:border-slate-800 relative">
                <Link
                    to="/"
                    className="absolute top-6 left-6 p-2 rounded-full bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-gray-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-all group"
                >
                    <ArrowLeft size={20} strokeWidth={2.5} className="group-hover:-translate-x-1 transition-transform" />
                </Link>

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white">Створити акаунт</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Стань частиною нашої школи</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Ім'я</label>
                            <input
                                type="text" name="first_name" required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                                value={formData.first_name}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Прізвище</label>
                            <input
                                type="text" name="last_name"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                                value={formData.last_name}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <input
                            type="email" name="email" required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                            placeholder="example@mail.com"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Пароль</label>
                        <input
                            type="password" name="password" required minLength={8}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                            placeholder="Мінімум 8 символів"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Підтвердіть пароль</label>
                        <input
                            type="password" name="password_confirm" required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                            placeholder="••••••••"
                            value={formData.password_confirm}
                            onChange={handleChange}
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
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none transition-all hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-2"
                    >
                        {isLoading ? 'Реєстрація...' : 'Зареєструватися'}
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-800 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                        Вже є акаунт?{' '}
                        <Link to="/login" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                            Увійти
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}