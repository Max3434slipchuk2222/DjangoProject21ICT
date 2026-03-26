import { useState } from 'react'
import { useGetCategoriesQuery } from '../services/marycoApi'
import { NavLink } from 'react-router-dom'
import logo from '../assets/icons/logo.png'

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false)
    const { data: categories = [] } = useGetCategoriesQuery()
    const [dropdownOpen, setDropdownOpen] = useState(false)

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center">

                <NavLink to="/" className="flex items-center gap-2 flex-shrink-0">
                    <img src={logo} alt="logo" className="w-12 h-12"/>
                    <span className="font-black text-gray-900 tracking-wide text-lg">
                        MARYCO <span className="text-blue-600">CLUB</span>
                    </span>
                </NavLink>

                <nav className="hidden md:flex items-center gap-1 ml-auto">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `px-4 py-2 rounded-lg font-bold text-sm transition-colors hover:bg-blue-50 hover:text-blue-600 ${isActive ? 'bg-blue-50 text-blue-600' : ''}`
                        }
                    >
                        Головна
                    </NavLink>

                    <div
                        className="relative"
                        onMouseEnter={() => setDropdownOpen(true)}
                        onMouseLeave={() => setDropdownOpen(false)}
                    >
                        <NavLink
                            to="/courses"
                            className={({ isActive }) =>
                                `px-4 py-2 rounded-lg font-bold text-sm transition-colors hover:bg-blue-50 hover:text-blue-600 flex items-center gap-1 ${isActive ? 'bg-blue-50 text-blue-600' : ''}`
                            }
                        >
                            Курси <span className="text-xs">▾</span>
                        </NavLink>

                        {dropdownOpen && (
                            <div className="absolute top-full left-0 mt-0 bg-white rounded-xl shadow-lg border border-gray-100 min-w-48 overflow-hidden z-50">
                                <div className="pt-2">
                                    <NavLink
                                        to="/courses"
                                        className="block px-4 py-3 text-sm font-bold hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                    >
                                        Всі курси
                                    </NavLink>
                                    {categories.map(cat => (
                                        <NavLink
                                            key={cat.id}
                                            to={`/courses/category/${cat.id}`}
                                            className="block px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors border-t border-gray-50"
                                        >
                                            {cat.name}
                                        </NavLink>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <NavLink
                        to="/teachers"
                        className={({ isActive }) =>
                            `px-4 py-2 rounded-lg font-bold text-sm transition-colors hover:bg-blue-50 hover:text-blue-600 ${isActive ? 'bg-blue-50 text-blue-600' : ''}`
                        }
                    >
                        Вчителі
                    </NavLink>

                    <NavLink
                        to="/contact"
                        className={({ isActive }) =>
                            `px-4 py-2 rounded-lg font-bold text-sm transition-colors hover:bg-blue-50 hover:text-blue-600 ${isActive ? 'bg-blue-50 text-blue-600' : ''}`
                        }
                    >
                        Контакти
                    </NavLink>
                </nav>

                <a href="#" className="hidden md:inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-lg text-sm transition-colors ml-4">
                    Вхід
                </a>

                <div className="md:hidden flex items-center flex-1 justify-between pl-4">
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="mx-auto flex flex-col gap-1.5 p-1"
                        aria-label="Меню"
                    >
                        <span className="block w-6 h-0.5 bg-gray-800"></span>
                        <span className="block w-6 h-0.5 bg-gray-800"></span>
                        <span className="block w-6 h-0.5 bg-gray-800"></span>
                    </button>
                    <a href="#" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-lg text-sm transition-colors">
                        Вхід
                    </a>
                </div>
            </div>

            {mobileOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white">
                    <div className="flex flex-col py-2">
                        <NavLink to="/" className="px-6 py-3 font-bold text-sm hover:bg-blue-50 hover:text-blue-600">
                            Головна
                        </NavLink>
                        <NavLink to="/courses" className="px-6 py-3 font-bold text-sm hover:bg-blue-50 hover:text-blue-600">
                            Всі курси
                        </NavLink>
                        {categories.map(cat => (
                            <NavLink
                                key={cat.id}
                                to={`/courses/category/${cat.id}`}
                                className="px-10 py-2 text-sm font-semibold text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                            >
                                {cat.name}
                            </NavLink>
                        ))}
                        <NavLink to="/teachers" className="px-6 py-3 font-bold text-sm hover:bg-blue-50 hover:text-blue-600">
                            Вчителі
                        </NavLink>
                        <NavLink to="/contact" className="px-6 py-3 font-bold text-sm hover:bg-blue-50 hover:text-blue-600">
                            Контакти
                        </NavLink>
                    </div>
                </div>
            )}
        </header>
    )
}