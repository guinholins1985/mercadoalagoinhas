import React, { useState } from 'react';
import { SearchIcon } from './icons/SearchIcon';
import { getThemeClasses } from '../utils/theme';

interface SearchBarProps {
    onSearch: (query: string) => void;
    themeColor: string;
}

export function SearchBar({ onSearch, themeColor }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const theme = getThemeClasses(themeColor);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSearch(query);
    };

    return (
        <form 
            className="flex items-center w-full max-w-2xl mx-auto mb-8 md:mb-12"
            onSubmit={handleSubmit}
        >
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Busque por produtos (ex: cesta, abacaxi, bolo)..."
                autoComplete="off"
                className={`flex-grow w-full px-5 py-3 text-base text-slate-700 bg-white border border-slate-300 rounded-l-full shadow-sm focus:outline-none focus:ring-2 ${theme.focusRing500} focus:border-transparent transition-shadow`}
            />
            <button
                type="submit"
                className={`px-6 py-3 ${theme.bg600} text-white font-semibold rounded-r-full ${theme.hoverBg700} focus:outline-none focus:ring-2 ${theme.focusRing500} focus:ring-offset-2 transition-colors flex items-center shadow-sm`}
                aria-label="Buscar"
            >
                <SearchIcon />
                <span className="hidden sm:inline ml-2">Buscar</span>
            </button>
        </form>
    );
}
