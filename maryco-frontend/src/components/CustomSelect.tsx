import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

// 1. Змінюємо extends string на extends string | number
export interface CustomSelectOption<T extends string | number> {
    value: T;
    label: string;
}

interface CustomSelectProps<T extends string | number> {
    value: T;
    onChange: (value: T) => void;
    options: CustomSelectOption<T>[];
    className?: string;
    buttonClassName?: string; // Додаємо можливість перевизначати стилі кнопки
}

export default function CustomSelect<T extends string | number>({
                                                                    value,
                                                                    onChange,
                                                                    options,
                                                                    className = '',
                                                                    buttonClassName = '',
                                                                }: CustomSelectProps<T>) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [open]);

    const selected = options.find((o) => o.value === value);

    return (
        <div ref={rootRef} className={`relative ${className}`}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="listbox"
                aria-expanded={open}
                // 2. Додаємо w-full justify-between та об'єднуємо з кастомними класами
                className={`flex w-full items-center justify-between gap-2 outline-none cursor-pointer transition-colors ${buttonClassName || 'text-sm font-bold bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 shadow-sm hover:border-blue-400 dark:hover:border-blue-500'}`}
            >
                {/* 3. Якщо нічого не обрано, можна виводити плейсхолдер, або покласти його в масив options */}
                <span className="truncate">{selected?.label}</span>
                <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform duration-200 flex-shrink-0 ${open ? 'rotate-180' : ''}`}
                />
            </button>

            {open && (
                <ul
                    role="listbox"
                    className="absolute left-0 right-0 z-20 mt-2 max-h-60 overflow-y-auto custom-scrollbar rounded-xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl animate-in fade-in slide-in-from-top-1 duration-150"
                >
                    {options.map((option) => {
                        const isActive = option.value === value;
                        return (
                            <li key={option.value} role="option" aria-selected={isActive}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onChange(option.value);
                                        setOpen(false);
                                    }}
                                    className={`flex w-full items-center justify-between gap-6 px-4 py-3 text-left text-sm font-semibold transition-colors ${
                                        isActive
                                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    <span className="truncate">{option.label}</span>
                                    {isActive && <Check size={15} className="flex-shrink-0" />}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}