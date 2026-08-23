// maryco-frontend/src/pages/ContactPage/index.tsx
import { useState } from 'react';
import { PatternFormat } from 'react-number-format';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa6';

const API = import.meta.env.VITE_API_BASE_URL;

const contacts = [
    {
        icon: MapPin,
        label: 'Адреса',
        value: 'м. Луцьк, вул. Набережна, 10',
        link: 'https://maps.app.goo.gl/PeqXrwoncotTkytA8',
        linkText: 'Переглянути на карті',
    },
    {
        icon: Phone,
        label: 'Телефон',
        value: '+38 (098) 703-34-95',
        link: 'tel:+380678972222',
        linkText: 'Зателефонувати',
    },
    {
        icon: Mail,
        label: 'Email',
        value: 'maryco.club.private.school@gmail.com',
        link: 'mailto:marycoclub@gmail.com',
        linkText: 'Написати листа',
    },
    {
        icon: Clock,
        label: 'Графік роботи',
        value: 'Пн–Сб: 9:00–19:30\nНд: вихідний',
        link: null,
        linkText: null,
    },
];

const socials = [
    {
        icon: FaFacebookF,
        label: 'Facebook',
        href: 'https://www.facebook.com/share/1L9za9JVTg/',
        bg: 'bg-blue-600',
    },
    {
        icon: FaInstagram,
        label: 'Instagram',
        href: 'https://www.instagram.com/marycoclub',
        bg: 'bg-gradient-to-br from-pink-500 via-red-500 to-yellow-400',
    },
    {
        icon: FaTiktok,
        label: 'TikTok',
        href: 'https://www.tiktok.com/@marycoclub',
        bg: 'bg-gray-900',
    },
];

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: '',
    });
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${API}/api/contact/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    phone: formData.phone,
                    email: formData.email,
                    message: formData.message,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setSent(true);
            } else {
                setError(data.detail || 'Сталася помилка. Спробуйте ще раз.');
            }
        } catch {
            setError('Немає з\'єднання з сервером. Перевірте інтернет.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen transition-colors">

            {/* Hero */}
            <section className="bg-gradient-to-br from-blue-600 to-indigo-700 py-20 px-4 text-center">
                <span className="inline-block text-blue-200 text-sm font-bold uppercase tracking-widest mb-4">
                    Ми завжди на зв'язку
                </span>
                <h1 className="text-5xl font-black text-white mb-4">Контакти</h1>
                <p className="text-blue-100 text-lg max-w-xl mx-auto">
                    Маєте питання? Залишіть заявку або зателефонуйте нам — ми відповімо якнайшвидше
                </p>
            </section>

            <div className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* Ліва колонка */}
                <div className="flex flex-col gap-6">
                    {contacts.map(({ icon: Icon, label, value, link, linkText }) => (
                        <div
                            key={label}
                            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm flex items-start gap-5 hover:shadow-md transition-shadow"
                        >
                            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Icon size={22} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
                                    {label}
                                </p>
                                <p className="text-gray-900 dark:text-white font-bold whitespace-pre-line leading-relaxed">
                                    {value}
                                </p>
                                {link && linkText && (
                                    <a
                                        href={link}
                                        target={link.startsWith('http') ? '_blank' : undefined}
                                        rel="noreferrer"
                                        className="text-sm text-blue-600 dark:text-blue-400 font-bold hover:underline mt-1 inline-block"
                                    >
                                        {linkText} →
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Соцмережі */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm">
                        <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
                            Соціальні мережі
                        </p>
                        <div className="flex gap-4">
                            {socials.map(({ icon: Icon, label, href, bg }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={label}
                                    className={`w-12 h-12 rounded-full ${bg} dark:border-2 flex items-center justify-center text-white hover:scale-110 hover:opacity-90 transition-all duration-200 shadow-md`}
                                >
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Google Maps */}
                    <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-slate-800 h-64">
                        <iframe
                            title="Maryco Club на карті"
                            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d5049.084409982728!2d25.3167596!3d50.7469792!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x472599fbfc433285%3A0x7d4488ca9dbe8705!2sMARYco%20club!5e0!3m2!1suk!2sua!4v1787219325328!5m2!1suk!2sua"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>

                {/* Права колонка: форма */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-100 dark:border-slate-800 shadow-xl h-fit">
                    {sent ? (
                        <div className="flex flex-col items-center text-center py-10 gap-4">
                            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                <CheckCircle2 size={44} className="text-green-500 dark:text-green-400" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white">Повідомлення надіслано!</h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                Дякуємо за звернення. Ми зв'яжемося з вами найближчим часом.
                            </p>
                            <button
                                onClick={() => {
                                    setSent(false);
                                    setFormData({ name: '', phone: '', email: '', message: '' });
                                }}
                                className="mt-4 px-8 py-3 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                            >
                                Надіслати ще раз
                            </button>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                                Написати нам
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
                                Заповніть форму і ми відповімо протягом одного робочого дня
                            </p>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                                        Ваше ім'я *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Іван Петренко"
                                        className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all font-medium"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                                            Телефон
                                        </label>
                                        <PatternFormat
                                            format="+380 (##) ###-##-##"
                                            allowEmptyFormatting
                                            mask="_"
                                            type="tel"
                                            value={formData.phone}
                                            onValueChange={(v) => setFormData({ ...formData, phone: v.formattedValue })}
                                            className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 text-gray-400 dark:text-gray-500 focus:border-blue-500 outline-none transition-all font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="your@email.com"
                                            className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                                        Повідомлення *
                                    </label>
                                    <textarea
                                        name="message"
                                        required
                                        rows={5}
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Розкажіть про ваше питання..."
                                        className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 text-gray-400 dark:text-gray-500 focus:border-blue-500 outline-none transition-all font-medium resize-none"
                                    />
                                </div>

                                {/* Error message */}
                                {error && (
                                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-xl px-4 py-3 text-sm text-red-600 dark:text-red-400 font-medium">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-lg shadow-blue-200 dark:shadow-none transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Відправляємо...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={18} />
                                            Надіслати повідомлення
                                        </>
                                    )}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}