import { NavLink } from 'react-router-dom'
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa6'
import {useState} from "react";
import {useSubscribeNewsletterMutation} from "../services/marycoApi.ts";
export default function Footer() {
    const currentYear = new Date().getFullYear()
    const [email, setEmail] = useState('');
    const [subscribe, { isLoading, isSuccess, isError }] = useSubscribeNewsletterMutation();
    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            await subscribe({ email });
            setEmail('');
        }
    };
    return (
        <footer className="bg-gray-900 text-gray-400 pt-16 mt-0">
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12">

                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <span className="font-black text-white tracking-wide text-xl text-center">
                            MARYCO <span className="text-blue-500">CLUB</span>
                        </span>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-500 max-w-xs">
                        Навчаємо дітей створювати майбутнє сьогодні.
                    </p>
                </div>

                <div>
                    <h4 className="text-white font-black mb-6 text-sm uppercase tracking-widest">Меню</h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                        <NavLink to="/" className="text-sm hover:text-white transition-colors">Про нас</NavLink>
                        <NavLink to="/teachers" className="text-sm hover:text-white transition-colors">Вчителі</NavLink>
                        <NavLink to="/courses" className="text-sm hover:text-white transition-colors">Всі курси</NavLink>
                        <NavLink to="/contact" className="text-sm hover:text-white transition-colors">Контакти</NavLink>
                    </div>
                </div>
                <div className="md:col-span-2 lg:col-span-1">
                    <h4 className="text-white font-black mb-6 text-sm uppercase tracking-widest">Розсилка</h4>
                    <p className="text-sm mb-4 leading-relaxed">Отримуйте новини про курси та спеціальні знижки першими.</p>

                    {isSuccess ? (
                        <div className="bg-green-500/20 text-green-400 p-3 rounded-xl text-sm font-bold border border-green-500/30">
                            Дякуємо за підписку!
                        </div>
                    ) : (
                        <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Ваш Email"
                                className="px-4 py-3 bg-gray-800 text-white rounded-xl text-sm outline-none border border-gray-700 focus:border-blue-500 transition-colors"
                            />
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm transition-colors disabled:opacity-50"
                            >
                                {isLoading ? 'Відправка...' : 'Підписатися'}
                            </button>
                            {isError && <span className="text-red-400 text-xs mt-1">Помилка. Можливо, ви вже підписані.</span>}
                        </form>
                    )}
                </div>
                <div className="flex flex-col gap-8">
                    <div>
                        <h4 className="text-white font-black mb-6 text-sm uppercase tracking-widest">Контакти</h4>
                        <div className="flex flex-col gap-3 text-sm">
                            <a href="tel:+380987033495" className="hover:text-blue-400 transition-colors">
                                +38 (098) 703-34-95
                            </a>
                            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=maryco.club.private.school@gmail.com" className="hover:text-blue-400 transition-colors">
                                maryco.club.private.school@gmail.com
                            </a>
                            <p className="leading-relaxed">
                                м. Луцьк, <br />
                                вул. Набережна, 10
                            </p>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-black mb-6 text-sm uppercase tracking-widest">Слідкуй за нами</h4>
                        <div className="flex gap-4">
                            <a href="https://www.facebook.com/share/1L9za9JVTg/"
                                className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white hover:scale-110 hover:opacity-90 transition-all duration-200">
                                <FaFacebookF size={18} />
                            </a>
                            <a href="https://www.instagram.com/marycoclub?igsh=MWJsZXQxMWdmY2E4Mg=="
                                className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 via-red-500 to-yellow-400 flex items-center justify-center text-white hover:scale-110 hover:opacity-90 transition-all duration-200">
                                <FaInstagram size={18} />
                            </a>
                            <a href="https://www.tiktok.com/@marycoclub?_r=1&_t=ZS-94xohYUjM76"
                               className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-900 hover:scale-110 hover:opacity-90 transition-all duration-200">
                                <FaTiktok size={18} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-800">
                <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-600">
                        © {currentYear} Maryco Club. Всі права захищені.
                    </p>
                    <div className="flex gap-6 text-xs text-gray-600">
                        <a href="#" className="hover:text-gray-400">Політика конфіденційності</a>
                        <a href="#" className="hover:text-gray-400">Публічна оферта</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}