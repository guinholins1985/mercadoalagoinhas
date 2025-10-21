import React from 'react';
import type { User } from '../types';
import { CartIcon } from './icons/CartIcon';

interface HeaderProps {
    user: User | null;
    onLogout: () => void;
    onLoginClick: () => void;
    storeName: string;
    themeColor: string;
}

export function Header({ user, onLogout, onLoginClick, storeName, themeColor }: HeaderProps) {
    const welcomeName = user?.type === 'admin' ? 'Administrador' : user?.name;
    
    return (
        <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-3">
                    {/* Left side: Logo */}
                    <div className="flex-shrink-0">
                         <h1 className={`text-2xl md:text-3xl font-extrabold text-${themeColor}-600`}>
                            <a href="/" aria-label={`Página inicial do ${storeName}`}>
                                🛒 {storeName}
                            </a>
                        </h1>
                    </div>

                    {/* Right side: Actions */}
                    <div className="flex items-center gap-4 md:gap-6">
                        <button className={`relative text-slate-600 hover:text-${themeColor}-600 transition-colors`} aria-label="Ver carrinho de compras">
                            <CartIcon />
                            <span className={`absolute -top-1 -right-2 bg-${themeColor}-600 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center`}>
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
                                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 invisible group-hover:visible">
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
                                className={`px-4 py-2 bg-${themeColor}-600 text-white font-semibold rounded-md hover:bg-${themeColor}-700 transition-colors text-sm`}
                            >
                                Entrar
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}