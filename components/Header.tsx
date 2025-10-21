import React from 'react';
import type { User } from '../types';
import { CartIcon } from './icons/CartIcon';
import { getThemeClasses } from '../utils/theme';

interface HeaderProps {
    user: User | null;
    onLogout: () => void;
    onLoginClick: () => void;
    storeName: string;
    themeColor: string;
    logoUrl: string | null;
    logoSize: number;
    centerLogo: boolean;
}

export function Header({ user, onLogout, onLoginClick, storeName, themeColor, logoUrl, logoSize, centerLogo }: HeaderProps) {
    const welcomeName = user?.type === 'admin' ? 'Administrador' : user?.name;
    const theme = getThemeClasses(themeColor);
    
    const logoContent = (
        <a href="/" aria-label={`Página inicial do ${storeName}`}>
            {logoUrl ? (
                <img 
                    src={logoUrl} 
                    alt={`${storeName} logo`} 
                    className="max-w-xs object-contain"
                    style={{ height: `${logoSize}px` }}
                />
            ) : (
                <h1 className={`text-2xl md:text-3xl font-extrabold ${theme.text600}`}>
                    🛒 {storeName}
                </h1>
            )}
        </a>
    );

    const actionsContent = (
         <div className="flex items-center gap-4 md:gap-6">
            <button className={`relative text-slate-600 ${theme.hoverText600} transition-colors`} aria-label="Ver carrinho de compras">
                <CartIcon />
                <span className={`absolute -top-1 -right-2 ${theme.bg600} text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center`}>
                    0
                </span>
            </button>

            <div className="h-6 w-px bg-slate-200"></div>

            {user ? (
                <div className="relative group">
                    <button className="text-sm text-slate-700 font-semibold flex items-center gap-2">
                        <span>Olá, {welcomeName}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 invisible group-hover:visible z-10">
                        <button
                            onClick={onLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                        >
                            Sair
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={onLoginClick}
                    className={`px-4 py-2 ${theme.bg600} text-white font-semibold rounded-md ${theme.hoverBg700} transition-colors text-sm`}
                >
                    Entrar
                </button>
            )}
        </div>
    );

    return (
        <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
            <div className="container mx-auto px-4">
                 {centerLogo ? (
                    <div className="grid grid-cols-3 items-center py-3">
                        {/* Placeholder for left side to balance the grid */}
                        <div></div>
                        <div className="flex justify-center">
                            {logoContent}
                        </div>
                        <div className="flex justify-end">
                            {actionsContent}
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-between items-center py-3">
                        <div className="flex-shrink-0">
                            {logoContent}
                        </div>
                        {actionsContent}
                    </div>
                )}
            </div>
        </header>
    );
}
