import React, { useState } from 'react';
import type { User } from '../types';
import { XCircleIcon } from './icons/XCircleIcon';
import { getThemeClasses } from '../utils/theme';

interface LoginPageProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (user: User) => void;
    users: User[];
    storeName: string;
    themeColor: string;
    logoUrl: string | null;
}

export function LoginPage({ isOpen, onClose, onLogin, users, storeName, themeColor, logoUrl }: LoginPageProps) {
    const [loginIdentifier, setLoginIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const theme = getThemeClasses(themeColor);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');

        const lowerCaseInput = loginIdentifier.toLowerCase();
        const foundUser = users.find(u => 
            u.email.toLowerCase() === lowerCaseInput ||
            u.name.toLowerCase() === lowerCaseInput
        );

        // NOTE: This is a mock login.
        const isValidPassword = 
            (foundUser?.type === 'admin' && password === 'a12') ||
            (foundUser?.type === 'customer' && password === '1234');

        if (foundUser && isValidPassword) { 
            onLogin(foundUser);
        } else {
            setError('Usuário/e-mail ou senha inválidos. Tente novamente.');
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
            aria-modal="true"
            role="dialog"
            onClick={onClose}
        >
            <div 
                className="relative max-w-md w-full bg-white p-8 rounded-lg shadow-xl"
                onClick={e => e.stopPropagation()} // Prevent closing modal when clicking inside
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                    aria-label="Fechar modal de login"
                >
                    <XCircleIcon />
                </button>

                <div className="text-center mb-8">
                     {logoUrl ? (
                        <img src={logoUrl} alt={`${storeName} logo`} className="h-12 max-w-full mx-auto object-contain mb-2" />
                    ) : (
                         <h1 className={`text-3xl font-extrabold ${theme.text600}`}>
                            🛒 {storeName}
                        </h1>
                    )}
                    <p className="mt-2 text-slate-600">
                        Acesse sua conta
                    </p>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="login" className="block text-sm font-medium text-slate-700">Usuário ou E-mail</label>
                        <input
                            type="text"
                            id="login"
                            value={loginIdentifier}
                            onChange={(e) => setLoginIdentifier(e.target.value)}
                            className={`mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 ${theme.focusRing500} ${theme.border500}`}
                            placeholder="Digite seu usuário ou e-mail"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700">Senha</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 ${theme.focusRing500} ${theme.border500}`}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    
                    {error && (
                        <p className="mb-4 text-sm text-red-600 text-center">{error}</p>
                    )}

                    <div>
                        <button
                            type="submit"
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${theme.bg600} ${theme.hoverBg700} focus:outline-none focus:ring-2 focus:ring-offset-2 ${theme.focusRing500}`}
                        >
                            Entrar
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center text-sm text-slate-500">
                    <p>Admin: <span className="font-semibold">ad</span> ou <span className="font-semibold">Admin</span> (senha: <span className="font-semibold">a12</span>)</p>
                    <p>Cliente: <span className="font-semibold">ana@example.com</span> ou <span className="font-semibold">Ana Silva</span> (senha: <span className="font-semibold">1234</span>)</p>
                </div>
            </div>
        </div>
    );
}
