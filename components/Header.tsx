import React from 'react';
import type { User } from '../types';

interface HeaderProps {
    user: User;
    onLogout: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
    const welcomeName = user.type === 'admin' ? 'Administrador' : user.name;
    
    return (
        <header className="relative text-center mb-8 md:mb-12">
            <div className="absolute top-0 right-0 text-right z-10">
                 <p className="text-sm text-slate-700" aria-live="polite">
                    Bem-vindo, <span className="font-bold">{welcomeName}</span>
                 </p>
                 <button
                    onClick={onLogout}
                    className="mt-1 px-3 py-1 bg-slate-200 text-slate-700 font-semibold rounded-md hover:bg-slate-300 transition-colors text-xs"
                 >
                    Sair
                 </button>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-green-600 drop-shadow-sm">
                🛒 Mercado Alagoinhas
            </h1>
            <p className="mt-2 text-lg text-slate-600">
                Compre direto do produtor!
            </p>
        </header>
    );
}
