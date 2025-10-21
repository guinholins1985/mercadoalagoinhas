import React, { useState } from 'react';
import type { User } from '../types';

interface LoginPageProps {
    onLogin: (user: User) => void;
    users: User[];
}

export function LoginPage({ onLogin, users }: LoginPageProps) {
    const [loginIdentifier, setLoginIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

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

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                <div className="text-center mb-8">
                     <h1 className="text-3xl font-extrabold text-green-600">
                        🛒 Mercado Alagoinhas
                    </h1>
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
                            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
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
                            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
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
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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