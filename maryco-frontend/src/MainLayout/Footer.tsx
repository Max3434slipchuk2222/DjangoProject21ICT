import { NavLink } from 'react-router-dom'
import facebookIcon from '../assets/icons/facebook.png'
import instagramIcon from '../assets/icons/instagram.png'
import tiktokIcon from '../assets/icons/tik-tok.png'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-gray-900 text-gray-400 pt-16 mt-20">
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 pb-12">

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

                <div>
                    <h4 className="text-white font-black mb-6 text-sm uppercase tracking-widest">Контакти</h4>
                    <div className="flex flex-col gap-3 text-sm">
                        <a href="tel:+380678972222" className="hover:text-blue-400 transition-colors">
                            +38 (067) 897-22-22
                        </a>
                        <a href="mailto:marycoclub@gmail.com" className="hover:text-blue-400 transition-colors">
                            marycoclub@gmail.com
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
                        <a href="https://www.facebook.com/share/1L9za9JVTg/" className="hover:scale-110 transition-transform duration-200">
                            <img src={facebookIcon} alt="Facebook" className="w-10 h-10 object-contain" />
                        </a>
                        <a href="https://www.instagram.com/marycoclub?igsh=MWJsZXQxMWdmY2E4Mg==" className="hover:scale-110 transition-transform duration-200">
                            <img src={instagramIcon} alt="Instagram" className="w-10 h-10 object-contain" />
                        </a>
                        <a href="https://www.tiktok.com/@marycoclub?_r=1&_t=ZS-94xohYUjM76" className="hover:scale-110 transition-transform duration-200">
                            <img src={tiktokIcon} alt="TikTok" className="w-10 h-10 object-contain" />
                        </a>
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