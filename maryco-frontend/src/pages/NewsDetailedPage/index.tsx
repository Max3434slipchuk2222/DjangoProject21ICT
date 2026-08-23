import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGetNewsQuery } from '../../services/marycoApi';
import { ArrowLeft, Calendar, Clock, Share2, BookOpen } from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;
const mediaUrl = (p: string | null | undefined) =>
    p ? (p.startsWith('http') ? p : `${API}${p}`) : null;

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('uk-UA', {
        day: 'numeric', month: 'long', year: 'numeric',
    });
}

function readingTime(text: string) {
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
}

export default function NewsDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: newsList = [], isLoading } = useGetNewsQuery();

    const article = newsList.find(n => String(n.id) === id);
    const others = newsList.filter(n => String(n.id) !== id).slice(0, 3);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({ title: article?.title, url: window.location.href });
        } else {
            navigator.clipboard.writeText(window.location.href);
        }
    };

    if (isLoading) return <NewsDetailSkeleton />;

    if (!article) return (
        <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center gap-4 px-4">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <BookOpen size={28} className="text-gray-400"/>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Новину не знайдено</h2>
            <button onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                <ArrowLeft size={16}/> Повернутися назад
            </button>
        </div>
    );

    const coverUrl = mediaUrl(article.image);
    const minutes = readingTime(article.content || '');

    return (
        <div className="min-h-screen transition-colors">

            {/* ── Hero ── */}
            <div className="relative w-full overflow-hidden" style={{ maxHeight: 520 }}>
                {coverUrl ? (
                    <>
                        <img
                            src={coverUrl}
                            alt={article.title}
                            className="w-full object-cover"
                            style={{ maxHeight: 520, minHeight: 320 }}
                        />
                        {/* gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"/>
                    </>
                ) : (
                    <div className="w-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center" style={{ height: 320 }}>
                        <BookOpen size={64} className="text-white/30"/>
                    </div>
                )}

                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-6 left-6 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-white/20 transition-all"
                >
                    <ArrowLeft size={15}/> Назад
                </button>

                {/* Hero title (shown over image) */}
                {coverUrl && (
                    <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 md:px-16 md:pb-12">
                        <div className="max-w-3xl mx-auto">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    Новини
                                </span>
                            </div>
                            <h1 className="text-2xl md:text-4xl font-black text-white leading-tight">
                                {article.title}
                            </h1>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Content area ── */}
            <div className="max-w-3xl mx-auto px-4 md:px-6 py-10">

                {/* Title (if no image) */}
                {!coverUrl && (
                    <div className="mb-6">
                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            Новини
                        </span>
                        <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mt-4 leading-tight">
                            {article.title}
                        </h1>
                    </div>
                )}

                {/* Meta row */}
                <div className="flex items-center justify-between flex-wrap gap-3 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1.5">
                            <Calendar size={14}/>
                            {formatDate(article.created_at)}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock size={14}/>
                            {minutes} хв читання
                        </span>
                    </div>
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                        <Share2 size={15}/> Поділитись
                    </button>
                </div>

                {/* Body text */}
                <div className="prose prose-lg dark:prose-invert max-w-none
                    prose-headings:font-black prose-headings:text-gray-900 dark:prose-headings:text-white
                    prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-p:leading-relaxed
                    prose-strong:text-gray-900 dark:prose-strong:text-white
                    prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                ">
                    {(article.content || '').split('\n').map((para, i) =>
                        para.trim() ? <p key={i}>{para}</p> : <br key={i}/>
                    )}
                </div>

                {/* ── More news ── */}
                {others.length > 0 && (
                    <div className="mt-16 pt-10 border-t border-gray-100 dark:border-gray-800">
                        <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6">
                            Читайте також
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {others.map(n => (
                                <Link
                                    key={n.id}
                                    to={`/news/${n.id}`}
                                    className="group block bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden hover:border-blue-200 dark:hover:border-blue-900 transition-all hover:shadow-md"
                                >
                                    <div className="h-32 overflow-hidden bg-gray-200 dark:bg-gray-800">
                                        {mediaUrl(n.image)
                                            ? <img src={mediaUrl(n.image)!} alt={n.title}
                                                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                                            : <div className="w-full h-full flex items-center justify-center text-3xl">📰</div>
                                        }
                                    </div>
                                    <div className="p-3">
                                        <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {n.title}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">{formatDate(n.created_at)}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function NewsDetailSkeleton() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 animate-pulse">
            <div className="w-full h-72 bg-gray-200 dark:bg-gray-800"/>
            <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
                <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-xl w-3/4"/>
                <div className="h-4 bg-gray-100 dark:bg-gray-800/60 rounded w-1/3"/>
                <div className="space-y-3 pt-4">
                    {Array(6).fill(0).map((_, i) => (
                        <div key={i} className={`h-4 bg-gray-100 dark:bg-gray-800/60 rounded ${i % 3 === 2 ? 'w-2/3' : 'w-full'}`}/>
                    ))}
                </div>
            </div>
        </div>
    );
}