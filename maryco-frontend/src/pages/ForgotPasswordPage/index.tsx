import { useState } from 'react';
import { useForgotPasswordMutation } from '../../services/marycoApi';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isSent, setIsSent] = useState(false);
    const [forgotPassword, { isLoading, error }] = useForgotPasswordMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await forgotPassword({ email }).unwrap();
            setIsSent(true);
        } catch (err) {
            console.error('Помилка відправки:', err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 px-4">
            <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 dark:border-slate-800">
                <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 mb-6 transition-colors">
                    <ArrowLeft size={16} /> Назад до входу
                </Link>

                {isSent ? (
                    <div className="text-center py-4">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                            <CheckCircle2 size={40} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Перевірте пошту</h2>
                        <p className="text-gray-500 dark:text-gray-400">
                            Ми надіслали інструкції для відновлення пароля на <b>{email}</b>
                        </p>
                    </div>
                ) : (
                    <>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Забули пароль?</h1>
                        <p className="text-gray-500 dark:text-gray-400 mb-8">
                            Введіть ваш email, і ми надішлемо вам код для створення нового пароля.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Email адреса</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
                                        placeholder="your@email.com"
                                    />
                                </div>
                                {error && <p className="text-red-500 text-xs mt-2 font-bold">Користувача з таким email не знайдено</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50"
                            >
                                {isLoading ? 'Відправка...' : 'Відправити код'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}