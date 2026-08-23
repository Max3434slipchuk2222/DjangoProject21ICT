import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

export interface CustomSelectOption<T extends string> {
    value: T;
    label: string;
}

interface CustomSelectProps<T extends string> {
    value: T;
    onChange: (value: T) => void;
    options: CustomSelectOption<T>[];
    className?: string;
}
export default function CustomSelect<T extends string>({
                                                           value,
                                                           onChange,
                                                           options,
                                                           className = '',
                                                       }: CustomSelectProps<T>) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);

    // Закриваємо дропдаун при кліку поза його межами.
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
                className="flex items-center gap-2 text-sm font-bold bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none cursor-pointer shadow-sm hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
            >
                {selected?.label}
                <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                />
            </button>

            {open && (
                <ul
                    role="listbox"
                    className="absolute right-0 z-20 mt-2 min-w-full w-max overflow-hidden rounded-xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl animate-in fade-in slide-in-from-top-1 duration-150"
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
                                    className={`flex w-full items-center justify-between gap-6 px-4 py-2.5 text-left text-sm font-semibold whitespace-nowrap transition-colors ${
                                        isActive
                                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    {option.label}
                                    {isActive && <Check size={15} />}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}