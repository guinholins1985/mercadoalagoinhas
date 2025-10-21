import React, { useState } from 'react';
import type { User } from '../types';

interface LoginPageProps {
    onLogin: (user: User) => void;
}

type ActiveTab = 'user' | 'admin';
type View = 'login' | 'register';

export function LoginPage({ onLogin }: LoginPageProps) {
    const [activeTab, setActiveTab] = useState<ActiveTab>('user');
    const [view, setView] = useState<View>('login');
    
    // Admin state
    const [adminUsername, setAdminUsername] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [adminError, setAdminError] = useState('');

    // User login state
    const [userUsername, setUserUsername] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [userError, setUserError] = useState('');
    
    // User registration state
    const [regFullName, setRegFullName] = useState('');
    const [regUsername, setRegUsername] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regError, setRegError] = useState('');


    const handleAdminLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (adminUsername === 'ad' && adminPassword === 'a12') {
            onLogin({ type: 'admin', name: 'Admin' });
        } else {
            setAdminError('Usuário ou senha inválidos.');
        }
    };

    const handleUserLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (userUsername.trim() && userPassword.trim()) {
            onLogin({ type: 'user', name: userUsername });
        } else {
            setUserError('Por favor, preencha todos os campos.');
        }
    };

    const handleUserRegister = (e: React.FormEvent) => {
        e.preventDefault();
        if (regFullName.trim() && regUsername.trim() && regEmail.trim() && regPassword.trim()) {
            // In a real app, you'd handle registration logic here.
            // For now, we'll just log the user in directly.
            onLogin({ type: 'user', name: regUsername });
        } else {
            setRegError('Por favor, preencha todos os campos.');
        }
    }

    const renderLoginForm = () => (
        <>
            <div className="mb-6">
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('user')}
                        className={`w-1/2 py-4 px-1 text-center text-sm font-medium border-b-2 transition-colors ${activeTab === 'user' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                        Comprador
                    </button>
                     <button
                        onClick={() => setActiveTab('admin')}
                        className={`w-1/2 py-4 px-1 text-center text-sm font-medium border-b-2 transition-colors ${activeTab === 'admin' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                        Administrador
                    </button>
                </div>
            </div>
            {activeTab === 'user' ? renderUserLoginForm() : renderAdminLoginForm()}
            <div className="mt-6 text-center">
                 <button onClick={() => setView('register')} className="text-sm font-medium text-green-600 hover:text-green-500">
                     Não tem uma conta? Cadastre-se
                 </button>
            </div>
        </>
    );

    const renderUserLoginForm = () => (
        <form onSubmit={handleUserLogin} className="space-y-6" noValidate>
            <div>
                <label htmlFor="user-username" className="block text-sm font-medium text-slate-700">Usuário</label>
                <input
                    id="user-username"
                    type="text"
                    value={userUsername}
                    onChange={(e) => { setUserUsername(e.target.value); setUserError(''); }}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="ex: joao.silva"
                    required
                />
            </div>
            <div>
                <div className="flex items-center justify-between">
                    <label htmlFor="user-password"  className="block text-sm font-medium text-slate-700">Senha</label>
                    <div className="text-sm">
                        <a href="#" className="font-medium text-green-600 hover:text-green-500" onClick={(e) => { e.preventDefault(); alert('Funcionalidade de recuperação de senha a ser implementada.'); }}>
                            Esqueceu a senha?
                        </a>
                    </div>
                </div>
                <input
                    id="user-password"
                    type="password"
                    value={userPassword}
                    onChange={(e) => { setUserPassword(e.target.value); setUserError(''); }}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="********"
                    required
                />
            </div>
            {userError && <p className="text-sm text-red-600">{userError}</p>}
            <div>
                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    Entrar
                </button>
            </div>
        </form>
    );

    const renderAdminLoginForm = () => (
         <form onSubmit={handleAdminLogin} className="space-y-6">
            <div>
                <label htmlFor="admin-username" className="block text-sm font-medium text-slate-700">Usuário Administrador</label>
                <input
                    id="admin-username"
                    type="text"
                    value={adminUsername}
                    onChange={(e) => { setAdminUsername(e.target.value); setAdminError(''); }}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="usuário de admin"
                />
            </div>
            <div>
                <label htmlFor="admin-password"  className="block text-sm font-medium text-slate-700">Senha</label>
                <input
                    id="admin-password"
                    type="password"
                    value={adminPassword}
                    onChange={(e) => { setAdminPassword(e.target.value); setAdminError(''); }}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="********"
                />
            </div>
            {adminError && <p className="text-sm text-red-600">{adminError}</p>}
            <div>
                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Entrar como Administrador
                </button>
            </div>
        </form>
    );

    const renderRegisterForm = () => (
        <>
            <h3 className="text-xl font-bold text-center text-slate-800 mb-6">Crie sua conta de Comprador</h3>
            <form onSubmit={handleUserRegister} className="space-y-4">
                <div>
                    <label htmlFor="reg-fullname" className="block text-sm font-medium text-slate-700">Nome Completo</label>
                    <input id="reg-fullname" type="text" value={regFullName} onChange={e => {setRegFullName(e.target.value); setRegError('');}} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm" required />
                </div>
                 <div>
                    <label htmlFor="reg-username" className="block text-sm font-medium text-slate-700">Usuário</label>
                    <input id="reg-username" type="text" value={regUsername} onChange={e => {setRegUsername(e.target.value); setRegError('');}} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm" required />
                </div>
                <div>
                    <label htmlFor="reg-email" className="block text-sm font-medium text-slate-700">E-mail</label>
                    <input id="reg-email" type="email" value={regEmail} onChange={e => {setRegEmail(e.target.value); setRegError('');}} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm" required />
                </div>
                <div>
                    <label htmlFor="reg-password"  className="block text-sm font-medium text-slate-700">Senha</label>
                    <input id="reg-password" type="password" value={regPassword} onChange={e => {setRegPassword(e.target.value); setRegError('');}} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm" required />
                </div>
                {regError && <p className="text-sm text-red-600">{regError}</p>}
                <div>
                    <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Cadastrar
                    </button>
                </div>
            </form>
            <div className="mt-6 text-center">
                 <button onClick={() => setView('login')} className="text-sm font-medium text-green-600 hover:text-green-500">
                     Já tem uma conta? Entre
                 </button>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h1 className="text-center text-4xl font-extrabold text-green-600 drop-shadow-sm">
                    🛒 Mercado Alagoinhas
                </h1>
                <h2 className="mt-6 text-center text-2xl font-bold text-slate-900">
                    {view === 'login' ? 'Acesse sua conta' : 'Crie sua conta'}
                </h2>
            </div>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
                    {view === 'login' ? renderLoginForm() : renderRegisterForm()}
                </div>
            </div>
        </div>
    );
}