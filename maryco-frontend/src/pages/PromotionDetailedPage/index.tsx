import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGetPromotionsQuery } from '../../services/marycoApi';
import { ArrowLeft, Calendar, Tag, Clock, Share2, Sparkles, ChevronRight } from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;
const mediaUrl = (p: string | null | undefined) =>
    p ? (p.startsWith('http') ? p : `${API}${p}`) : null;

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('uk-UA', {
        day: 'numeric', month: 'long', year: 'numeric',
    });
}

function daysLeft(validUntil: string | null): number | null {
    if (!validUntil) return null;
    const diff = new Date(validUntil).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function PromotionDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: promotions = [], isLoading } = useGetPromotionsQuery();

    const promo = promotions.find(p => String(p.id) === id);
    const others = promotions.filter(p => String(p.id) !== id && p.is_active).slice(0, 3);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({ title: promo?.title, url: window.location.href });
        } else {
            navigator.clipboard.writeText(window.location.href);
        }
    };

    if (isLoading) return <PromoDetailSkeleton />;

    if (!promo) return (
        <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center gap-4 px-4">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Tag size={28} className="text-gray-400"/>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Акцію не знайдено</h2>
            <button onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold hover:underline">
                <ArrowLeft size={16}/> Повернутися назад
            </button>
        </div>
    );

    const coverUrl = mediaUrl(promo.image);
    const days = daysLeft(promo.valid_until);
    const isExpiring = days !== null && days <= 3;
    const isExpired = days === 0;

    return (
        <div className="min-h-screen transition-colors">

            {/* ── Hero ── */}
            <div className="relative w-full overflow-hidden bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950/40 dark:to-orange-950/30"
                 style={{ minHeight: 340 }}>

                {coverUrl && (
                    <>
                        <img src={coverUrl} alt={promo.title}
                             className="absolute inset-0 w-full h-full object-cover opacity-20 dark:opacity-10"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/60 to-transparent dark:from-black/60"/>
                    </>
                )}

                {/* Back */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-6 left-6 flex items-center gap-2 bg-white/80 dark:bg-black/30 backdrop-blur-md border border-white/40 dark:border-white/10 text-gray-800 dark:text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-white dark:hover:bg-white/10 transition-all"
                >
                    <ArrowLeft size={15}/> Назад
                </button>

                {/* Share */}
                <button
                    onClick={handleShare}
                    className="absolute top-6 right-6 p-2.5 bg-white/80 dark:bg-black/30 backdrop-blur-md border border-white/40 dark:border-white/10 text-gray-700 dark:text-white rounded-full hover:bg-white dark:hover:bg-white/10 transition-all"
                >
                    <Share2 size={16}/>
                </button>

                {/* Hero content */}
                <div className="relative max-w-3xl mx-auto px-6 pt-24 pb-12 md:px-10">
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                        <span className="bg-amber-500 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                            <Sparkles size={11}/> Акція
                        </span>
                        {promo.discount && (
                            <span className="bg-white dark:bg-gray-900 text-amber-600 dark:text-amber-400 text-sm font-black px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                                -{promo.discount}
                            </span>
                        )}
                        {isExpired && (
                            <span className="bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs font-bold px-3 py-1 rounded-full">
                                Завершена
                            </span>
                        )}
                        {isExpiring && !isExpired && (
                            <span className="bg-rose-500 text-white text-xs font-black px-3 py-1 rounded-full animate-pulse">
                                Закінчується через {days} дн.
                            </span>
                        )}
                    </div>

                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight">
                        {promo.title}
                    </h1>
                </div>
            </div>

            {/* ── Content ── */}
            <div className="max-w-3xl mx-auto px-4 md:px-6 py-10">

                {/* Info cards row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                    {promo.discount && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 rounded-2xl p-4 text-center">
                            <Tag size={18} className="text-amber-500 mx-auto mb-1"/>
                            <p className="text-xl font-black text-amber-600 dark:text-amber-400">-{promo.discount}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">Знижка</p>
                        </div>
                    )}
                    {promo.valid_until && (
                        <div className={`border rounded-2xl p-4 text-center ${
                            isExpired
                                ? 'bg-gray-50 dark:bg-gray-800/30 border-gray-100 dark:border-gray-700'
                                : isExpiring
                                    ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800/30'
                                    : 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800/30'
                        }`}>
                            <Calendar size={18} className={`mx-auto mb-1 ${
                                isExpired ? 'text-gray-400' : isExpiring ? 'text-rose-500' : 'text-green-500'
                            }`}/>
                            <p className={`text-sm font-black ${
                                isExpired ? 'text-gray-500' : isExpiring ? 'text-rose-600 dark:text-rose-400' : 'text-green-600 dark:text-green-400'
                            }`}>
                                {formatDate(promo.valid_until)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">Діє до</p>
                        </div>
                    )}
                    {days !== null && !isExpired && (
                        <div className={`border rounded-2xl p-4 text-center ${
                            isExpiring
                                ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800/30'
                                : 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/30'
                        }`}>
                            <Clock size={18} className={`mx-auto mb-1 ${isExpiring ? 'text-rose-500' : 'text-blue-500'}`}/>
                            <p className={`text-xl font-black ${isExpiring ? 'text-rose-600 dark:text-rose-400' : 'text-blue-600 dark:text-blue-400'}`}>
                                {days}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">Днів залишилось</p>
                        </div>
                    )}
                </div>

                {/* Description */}
                {promo.description && (
                    <div className="mb-8">
                        <h2 className="text-lg font-black text-gray-900 dark:text-white mb-3">Про акцію</h2>
                        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
                            {promo.description.split('\n').map((para, i) =>
                                para.trim()
                                    ? <p key={i} className="text-gray-600 dark:text-gray-300 leading-relaxed mb-2 last:mb-0">{para}</p>
                                    : <br key={i}/>
                            )}
                        </div>
                    </div>
                )}

                {/* CTA */}
                {!isExpired && (
                    <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white text-center mb-10">
                        <Sparkles size={28} className="mx-auto mb-3 opacity-80"/>
                        <h3 className="text-xl font-black mb-2">Скористайтесь пропозицією!</h3>
                        <p className="text-amber-100 text-sm mb-4">
                            {days !== null ? `Залишилось лише ${days} ${days === 1 ? 'день' : 'дні'}` : 'Обмежена пропозиція'}
                        </p>
                        <Link
                            to="/contact"
                            className="inline-flex items-center gap-2 bg-white text-amber-600 font-black px-6 py-3 rounded-xl hover:bg-amber-50 transition-colors"
                        >
                            Записатися зі знижкою <ChevronRight size={16}/>
                        </Link>
                    </div>
                )}

                {/* Other promos */}
                {others.length > 0 && (
                    <div className="pt-8 border-t border-gray-100 dark:border-gray-800">
                        <h3 className="text-lg font-black text-gray-900 dark:text-white mb-5">Інші акції</h3>
                        <div className="space-y-3">
                            {others.map(p => {
                                const d = daysLeft(p.valid_until);
                                return (
                                    <Link
                                        key={p.id}
                                        to={`/promotions/${p.id}`}
                                        className="group flex items-center gap-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 hover:border-amber-200 dark:hover:border-amber-800 transition-all hover:shadow-sm"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                            {mediaUrl(p.image)
                                                ? <img src={mediaUrl(p.image)!} alt="" className="w-full h-full object-cover rounded-xl"/>
                                                : <Tag size={20} className="text-amber-500"/>
                                            }
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
                                                {p.title}
                                            </p>
                                            {p.discount && (
                                                <p className="text-xs text-amber-600 dark:text-amber-400 font-bold mt-0.5">-{p.discount}</p>
                                            )}
                                        </div>
                                        {d !== null && d > 0 && (
                                            <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">{d} дн.</span>
                                        )}
                                        <ChevronRight size={16} className="text-gray-300 dark:text-gray-600 group-hover:text-amber-400 transition-colors flex-shrink-0"/>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function PromoDetailSkeleton() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 animate-pulse">
            <div className="w-full h-72 bg-amber-50 dark:bg-gray-800"/>
            <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                    {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl"/>
                    ))}
                </div>
                <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-xl w-1/4 mt-6"/>
                <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-2xl"/>
            </div>
        </div>
    );
}