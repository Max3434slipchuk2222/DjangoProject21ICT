import { useState } from 'react'
import { useGetCategoriesQuery } from '../services/marycoApi'
import { NavLink } from 'react-router-dom'
import logo from '../assets/icons/logo.png'
import { Moon, Sun } from "lucide-react";
import useDarkMode from "../hooks/UseDarkMode.ts";

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false)
    const { data: categories = [] } = useGetCategoriesQuery()
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const { isDark, toggleTheme } = useDarkMode();

    return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 transition-colors">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center">

            <NavLink to="/" className="flex items-center gap-2 flex-shrink-0">
                <img src={logo} alt="logo" className="w-12 h-12"/>
                <span className="font-black text-gray-900 dark:text-white tracking-wide text-lg">
                        MARYCO <span className="text-blue-600">CLUB</span>
                    </span>
            </NavLink>


            <nav className="hidden md:flex items-center gap-1 ml-auto">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `px-4 py-2 rounded-lg font-bold text-sm transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 dark:text-gray-300 ${isActive ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : ''}`
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
                            `px-4 py-2 rounded-lg font-bold text-sm transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 dark:text-gray-300 flex items-center gap-1 ${isActive ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : ''}`
                        }
                    >
                        Курси <span className="text-xs">▾</span>
                    </NavLink>

                    {dropdownOpen && (
                        <div className="absolute top-full left-0 mt-0 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 min-w-48 overflow-hidden z-50">
                            <div className="pt-2">
                                <NavLink
                                    to="/courses"
                                    className="block px-4 py-3 text-sm font-bold text-gray-900 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 transition-colors"
                                >
                                    Всі курси
                                </NavLink>
                                {categories.map(cat => (
                                    <NavLink
                                        key={cat.id}
                                        to={`/courses/category/${cat.id}`}
                                        className="block px-4 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 transition-colors border-t border-gray-50 dark:border-gray-700"
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
                        `px-4 py-2 rounded-lg font-bold text-sm transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 dark:text-gray-300 ${isActive ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : ''}`
                    }
                >
                    Вчителі
                </NavLink>

                <NavLink
                    to="/contact"
                    className={({ isActive }) =>
                        `px-4 py-2 rounded-lg font-bold text-sm transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 dark:text-gray-300 ${isActive ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : ''}`
                    }
                >
                    Контакти
                </NavLink>
            </nav>


            <div className="flex items-center gap-3 md:gap-4 ml-auto md:ml-6">

                <a href="#" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 md:px-5 py-2 rounded-lg text-sm transition-colors shrink-0">
                    Вхід
                </a>

                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shrink-0"
                >
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>


                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden flex flex-col gap-1.5 p-1 ml-1"
                    aria-label="Меню"
                >
                    <span className="block w-6 h-0.5 bg-gray-800 dark:bg-gray-200"></span>
                    <span className="block w-6 h-0.5 bg-gray-800 dark:bg-gray-200"></span>
                    <span className="block w-6 h-0.5 bg-gray-800 dark:bg-gray-200"></span>
                </button>

            </div>
        </div>

        {mobileOpen && (
            <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors">
                <div className="flex flex-col py-2">
                    <NavLink to="/" className="px-6 py-3 font-bold text-sm dark:text-white hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600">
                        Головна
                    </NavLink>
                    <NavLink to="/courses" className="px-6 py-3 font-bold text-sm dark:text-white hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600">
                        Всі курси
                    </NavLink>
                    {categories.map(cat => (
                        <NavLink
                            key={cat.id}
                            to={`/courses/category/${cat.id}`}
                            className="px-10 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600"
                        >
                            {cat.name}
                        </NavLink>
                    ))}
                    <NavLink to="/teachers" className="px-6 py-3 font-bold text-sm dark:text-white hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600">
                        Вчителі
                    </NavLink>
                    <NavLink to="/contact" className="px-6 py-3 font-bold text-sm dark:text-white hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600">
                        Контакти
                    </NavLink>
                </div>
            </div>
        )}
    </header>
)
}