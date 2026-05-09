import { Link } from 'react-router-dom';
import { ShieldOff } from 'lucide-react';

export default function ForbiddenPage() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldOff size={44} className="text-red-500" />
                </div>
                <h1 className="text-6xl font-black text-gray-900 dark:text-white mb-2">403</h1>
                <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">Доступ заборонено</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8">
                    У вас недостатньо прав для перегляду цієї сторінки.
                </p>
                <Link
                    to="/"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl transition-all hover:-translate-y-0.5"
                >
                    На головну
                </Link>
            </div>
        </div>
    );
}
