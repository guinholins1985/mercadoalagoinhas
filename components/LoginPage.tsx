import React, { useState } from 'react';
import type { User, Seller } from '../types';
import { USERS } from '../constants';

interface LoginPageProps {
    onLogin: (user: User) => void;
    onRegisterSeller: (sellerData: Omit<Seller, 'id'>) => void;
}

type ActiveTab = 'login' | 'register';

export function LoginPage({ onLogin, onRegisterSeller }: LoginPageProps) {
    const [activeTab, setActiveTab] = useState<ActiveTab>('login');
    const [isLoading, setIsLoading] = useState(false);

    // Login State
    const [selectedUserId, setSelectedUserId] = useState<string>(USERS[0].id);
    
    // Register State
    const [sellerName, setSellerName] = useState('');
    const [sellerEmail, setSellerEmail] = useState('');
    const [sellerPhone, setSellerPhone] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);


    const handleLoginSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            const user = USERS.find(u => u.id === selectedUserId);
            if (user) {
                onLogin(user);
            }
            setIsLoading(false);
        }, 500);
    };

    const handleRegisterSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if(!sellerName || !sellerEmail || !sellerPhone) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        setIsLoading(true);
        
        const today = new Date();
        today.setDate(today.getDate() + 30); // Set expiration 30 days from now
        const expirationDate = today.toISOString().split('T')[0];

        const newSellerData: Omit<Seller, 'id'> = {
            nomeCompleto: sellerName,
            email: sellerEmail,
            telefone: sellerPhone,
            cpfCnpj: '',
            enderecoCompleto: '',
            categoriaDeProduto: '',
            status: 'Pendente',
            plan: 'Básico',
            subscriptionStatus: 'Ativa',
            vencimentoAssinatura: expirationDate,
        };
        
        setTimeout(() => {
            onRegisterSeller(newSellerData);
            setIsLoading(false);
            setShowSuccessMessage(true);
            setSellerName('');
            setSellerEmail('');
            setSellerPhone('');
        }, 1000);
    };

    const TabButton: React.FC<{tabId: ActiveTab, currentTab: ActiveTab, children: React.ReactNode}> = ({ tabId, currentTab, children }) => (
         <button
            onClick={() => setActiveTab(tabId)}
            className={`w-1/2 py-3 font-semibold text-center focus:outline-none transition-colors ${
                currentTab === tabId 
                ? 'text-green-600 border-b-2 border-green-600' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
        >
            {children}
        </button>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-extrabold text-green-600">
                        🛒 Mercado Alagoinhas
                    </h1>
                </div>

                <div className="flex border-b mb-6">
                    <TabButton tabId="login" currentTab={activeTab}>Entrar</TabButton>
                    <TabButton tabId="register" currentTab={activeTab}>Cadastrar Vendedor</TabButton>
                </div>
                
                {activeTab === 'login' ? (
                     <form onSubmit={handleLoginSubmit}>
                        <p className="text-center text-slate-600 mb-6">Acesse sua conta para continuar.</p>
                        <div className="mb-6">
                            <label htmlFor="user-select" className="block text-sm font-medium text-slate-700 mb-2">
                                Selecione um usuário para simular o login:
                            </label>
                            <select
                                id="user-select"
                                value={selectedUserId}
                                onChange={(e) => setSelectedUserId(e.target.value)}
                                className="block w-full px-4 py-3 text-base text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                                {USERS.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} ({user.type === 'admin' ? 'Admin' : 'Cliente'})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300"
                            >
                                {isLoading ? 'Entrando...' : 'Entrar'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
                        {showSuccessMessage ? (
                            <div className="text-center p-4 bg-green-100 text-green-800 rounded-lg">
                                <h3 className="font-bold text-lg">Cadastro enviado com sucesso!</h3>
                                <p className="mt-2">Seu cadastro será analisado pela nossa equipe. Você receberá um e-mail quando for aprovado.</p>
                                <button onClick={() => setShowSuccessMessage(false)} className="mt-4 font-semibold underline">Fazer novo cadastro</button>
                            </div>
                        ) : (
                             <form onSubmit={handleRegisterSubmit} className="space-y-4">
                                <p className="text-center text-slate-600 mb-4">Preencha seus dados para começar a vender.</p>
                                 <div>
                                    <label htmlFor="seller-name" className="block text-sm font-medium text-slate-700">Nome Completo</label>
                                    <input type="text" id="seller-name" value={sellerName} onChange={e => setSellerName(e.target.value)} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500" required />
                                </div>
                                 <div>
                                    <label htmlFor="seller-email" className="block text-sm font-medium text-slate-700">E-mail</label>
                                    <input type="email" id="seller-email" value={sellerEmail} onChange={e => setSellerEmail(e.target.value)} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500" required />
                                </div>
                                <div>
                                    <label htmlFor="seller-phone" className="block text-sm font-medium text-slate-700">Telefone (WhatsApp)</label>
                                    <input type="tel" id="seller-phone" value={sellerPhone} onChange={e => setSellerPhone(e.target.value)} placeholder="71999999999" className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500" required />
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300"
                                    >
                                        {isLoading ? 'Enviando...' : 'Finalizar Cadastro'}
                                    </button>
                                </div>
                             </form>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
