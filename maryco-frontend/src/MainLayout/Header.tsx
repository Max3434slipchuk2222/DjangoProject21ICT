import { useState } from 'react'
import { useGetCategoriesQuery } from '../services/marycoApi'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import logo from '../assets/icons/logo.png'
import { Moon, Sun, Menu, X, User as UserIcon, LogOut, LayoutDashboard } from "lucide-react";
import useDarkMode from "../hooks/UseDarkMode.ts";
import type { RootState } from "../store";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice.ts";

export default function Header() {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const { data: categories = [] } = useGetCategoriesQuery();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { isDark, toggleTheme } = useDarkMode();

    const handleMobileClick = () => setMobileOpen(false);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
        setMobileOpen(false);
    };

    // Посилання на дашборд залежно від ролі
    const dashboardLink = user?.role === 'admin'
        ? '/admin-panel'
        : user?.role === 'teacher'
            ? '/teacher-dashboard'
            : null;

    // Відображуване ім'я
    const displayName = user?.first_name || user?.username || 'Кабінет';
    const avatarLetter = displayName.charAt(0).toUpperCase();

    return (
        <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 transition-colors relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between w-full">

                {/* ЛІВА ЧАСТИНА: Логотип */}
                <div className="flex-shrink-0 flex items-center w-auto lg:w-1/4">
                    <NavLink to="/" onClick={handleMobileClick} className="flex items-center gap-2 group">
                        <img src={logo} alt="logo" className="w-10 h-10 sm:w-12 sm:h-12 transition-transform group-hover:scale-105" />
                        <span className="font-black text-gray-900 dark:text-white tracking-wide text-lg sm:text-xl">
                            MARYCO <span className="text-blue-600">CLUB</span>
                        </span>
                    </NavLink>
                </div>

                {/* ЦЕНТРАЛЬНА ЧАСТИНА: Навігація (тільки десктоп) */}
                <nav className="hidden md:flex items-center justify-center gap-8 flex-1">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `py-2 font-bold text-[15px] transition-colors border-b-2 ${isActive ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white'}`
                        }
                    >
                        Головна
                    </NavLink>

                    <div
                        className="relative group"
                        onMouseEnter={() => setDropdownOpen(true)}
                        onMouseLeave={() => setDropdownOpen(false)}
                    >
                        <NavLink
                            to="/courses"
                            className={({ isActive }) =>
                                `py-2 font-bold text-[15px] transition-colors border-b-2 flex items-center gap-1 ${isActive ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white'}`
                            }
                        >
                            Курси <span className="text-xs transition-transform duration-200 group-hover:rotate-180">▼</span>
                        </NavLink>

                        {dropdownOpen && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-56 z-50">
                                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden">
                                    <NavLink
                                        to="/courses"
                                        className="block px-5 py-3.5 text-sm font-black text-gray-900 dark:text-white hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 transition-colors"
                                    >
                                        Всі напрямки
                                    </NavLink>
                                    <div className="h-px bg-gray-100 dark:bg-slate-700 mx-4"></div>
                                    {categories.map(cat => (
                                        <NavLink
                                            key={cat.id}
                                            to={`/courses/category/${cat.id}`}
                                            className="block px-5 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 transition-colors"
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
                            `py-2 font-bold text-[15px] transition-colors border-b-2 ${isActive ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white'}`
                        }
                    >
                        Вчителі
                    </NavLink>

                    <NavLink
                        to="/contact"
                        className={({ isActive }) =>
                            `py-2 font-bold text-[15px] transition-colors border-b-2 ${isActive ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white'}`
                        }
                    >
                        Контакти
                    </NavLink>

                    {isAuthenticated && (
                        <NavLink
                            to="/reviews"
                            className={({ isActive }) =>
                                `py-2 font-bold text-[15px] transition-colors border-b-2 ${isActive ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white'}`
                            }
                        >
                            Відгуки
                        </NavLink>
                    )}
                </nav>

                {/* ПРАВА ЧАСТИНА: Авторизація та Тема */}
                <div className="flex items-center justify-end gap-3 lg:w-1/4">

                    <button
                        onClick={toggleTheme}
                        className="p-2.5 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all shrink-0"
                        title={isDark ? "Світла тема" : "Темна тема"}
                    >
                        {isDark ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {/* Десктоп: кнопки авторизації */}
                    <div className="hidden md:flex items-center space-x-3 ml-2">
                        {!isAuthenticated ? (
                            <>
                                <Link
                                    to="/login"
                                    className="px-5 py-2.5 font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors"
                                >
                                    Увійти
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                                >
                                    Реєстрація
                                </Link>
                            </>
                        ) : (
                            <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-800 py-1.5 px-2 pl-4 rounded-full border border-gray-100 dark:border-slate-700">
                                {/* Дашборд для teacher/admin */}
                                {dashboardLink && (
                                    <Link
                                        to={dashboardLink}
                                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
                                        title={user?.role === 'admin' ? 'Адмін-панель' : 'Панель вчителя'}
                                    >
                                        <LayoutDashboard size={18} />
                                    </Link>
                                )}
                                <Link to="/profile" className="flex items-center gap-2 group">
                                    <span className="font-bold text-sm text-gray-700 dark:text-gray-200 group-hover:text-blue-600 transition-colors">
                                        {displayName}
                                    </span>
                                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 font-black group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        {avatarLetter}
                                    </div>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors"
                                    title="Вийти"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Кнопка мобільного меню */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden p-2.5 ml-1 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                        aria-label="Меню"
                    >
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* МОБІЛЬНЕ МЕНЮ */}
            {mobileOpen && (
                <div className="md:hidden absolute top-full left-0 w-full border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl transition-colors z-40">
                    <div className="flex flex-col py-4 px-6 max-h-[80vh] overflow-y-auto space-y-2">
                        <NavLink to="/" onClick={handleMobileClick} className="px-4 py-3 rounded-xl font-bold text-lg dark:text-white hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600">
                            Головна
                        </NavLink>

                        <div className="px-4 py-2">
                            <NavLink to="/courses" onClick={handleMobileClick} className="font-bold text-lg dark:text-white hover:text-blue-600">
                                Всі курси
                            </NavLink>
                            <div className="mt-3 ml-4 flex flex-col gap-2 border-l-2 border-gray-100 dark:border-slate-800 pl-4">
                                {categories.map(cat => (
                                    <NavLink
                                        key={cat.id}
                                        to={`/courses/category/${cat.id}`}
                                        onClick={handleMobileClick}
                                        className="text-base font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                                    >
                                        {cat.name}
                                    </NavLink>
                                ))}
                            </div>
                        </div>

                        <NavLink to="/teachers" onClick={handleMobileClick} className="px-4 py-3 rounded-xl font-bold text-lg dark:text-white hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600">
                            Вчителі
                        </NavLink>
                        <NavLink to="/contact" onClick={handleMobileClick} className="px-4 py-3 rounded-xl font-bold text-lg dark:text-white hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600">
                            Контакти
                        </NavLink>

                        {isAuthenticated && (
                            <NavLink to="/reviews" onClick={handleMobileClick} className="px-4 py-3 rounded-xl font-bold text-lg dark:text-white hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600">
                                Відгуки
                            </NavLink>
                        )}

                        <div className="mt-4 pt-6 border-t border-gray-100 dark:border-slate-800 flex flex-col gap-3">
                            {!isAuthenticated ? (
                                <>
                                    <Link
                                        to="/login"
                                        onClick={handleMobileClick}
                                        className="w-full text-center px-4 py-3.5 font-bold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-slate-800 rounded-xl hover:bg-gray-200 transition-colors"
                                    >
                                        Увійти
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={handleMobileClick}
                                        className="w-full text-center px-4 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md transition-all"
                                    >
                                        Створити акаунт
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/profile"
                                        onClick={handleMobileClick}
                                        className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold rounded-xl"
                                    >
                                        <UserIcon size={20} />
                                        Кабінет ({displayName})
                                    </Link>
                                    {dashboardLink && (
                                        <Link
                                            to={dashboardLink}
                                            onClick={handleMobileClick}
                                            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-200 font-bold rounded-xl"
                                        >
                                            <LayoutDashboard size={20} />
                                            {user?.role === 'admin' ? 'Адмін-панель' : 'Панель вчителя'}
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3.5 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                                    >
                                        <LogOut size={20} />
                                        Вийти
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
