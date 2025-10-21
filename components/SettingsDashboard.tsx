
import React, { useState } from 'react';
import { CreditCardIcon } from './icons/CreditCardIcon';
import { MailIcon } from './icons/MailIcon';
import { ApiIcon } from './icons/ApiIcon';
import { ApiGatewayManager } from './ApiGatewayManager';
import { EditIcon } from './icons/EditIcon';
import { CheckIcon } from './icons/CheckIcon';

type Gateway = 'Mercado Pago' | 'PagSeguro' | 'Asaas' | 'PicPay' | 'Pix';

type GatewayConfig = {
    active: boolean;
    configured: boolean;
    credentials: Record<string, string>;
};

const gateways: Gateway[] = ['Mercado Pago', 'PagSeguro', 'Asaas', 'PicPay', 'Pix'];
const paymentMethods = ['Cartão de crédito (até 12x)', 'Cartão de débito', 'Pix', 'Boleto bancário'];

const initialGatewayConfigs: Record<Gateway, GatewayConfig> = {
    'Mercado Pago': { active: true, configured: true, credentials: { clientId: 'CLIENT_ID_MOCK', clientSecret: 'CLIENT_SECRET_MOCK' }},
    'PagSeguro': { active: false, configured: false, credentials: { email: '', token: '' }},
    'Asaas': { active: true, configured: false, credentials: { apiKey: '' }},
    'PicPay': { active: false, configured: false, credentials: { picpayToken: '', sellerToken: '' }},
    'Pix': { active: true, configured: true, credentials: { chavePix: 'CHAVE_PIX_MOCK' }},
};

const getCredentialFields = (gateway: Gateway): Record<string, string> => {
    switch (gateway) {
        case 'Mercado Pago': return { clientId: 'Client ID', clientSecret: 'Client Secret' };
        case 'PagSeguro': return { email: 'E-mail da Conta', token: 'Token de Produção' };
        case 'Asaas': return { apiKey: 'Chave de API (apiKey)' };
        case 'PicPay': return { picpayToken: 'x-picpay-token', sellerToken: 'x-seller-token' };
        case 'Pix': return { chavePix: 'Chave Pix' };
        default: return {};
    }
};


// A simple toggle switch component for UI
const ToggleSwitch: React.FC<{ enabled: boolean; onChange: () => void }> = ({ enabled, onChange }) => {
    return (
        <button
            type="button"
            onClick={onChange}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                enabled ? 'bg-green-600' : 'bg-slate-300'
            }`}
        >
            <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                    enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
        </button>
    );
};

export function SettingsDashboard() {
    const [gatewayConfigs, setGatewayConfigs] = useState(initialGatewayConfigs);
    const [editingGateway, setEditingGateway] = useState<Gateway | null>(null);
    const [currentCredentials, setCurrentCredentials] = useState<Record<string, string>>({});

    const handleToggleGateway = (gateway: Gateway) => {
        setGatewayConfigs(prev => ({
            ...prev,
            [gateway]: { ...prev[gateway], active: !prev[gateway].active },
        }));
    };

    const handleStartEditing = (gateway: Gateway) => {
        setEditingGateway(gateway);
        setCurrentCredentials(gatewayConfigs[gateway].credentials);
    };

    const handleCancelEditing = () => {
        setEditingGateway(null);
        setCurrentCredentials({});
    };

    const handleSaveConfig = () => {
        if (!editingGateway) return;
        
        // FIX: Added a type check to ensure `val` is a string before calling `trim()`.
        // This resolves the TypeScript error "Property 'trim' does not exist on type 'unknown'".
        const isConfigured = Object.values(currentCredentials).some(val => typeof val === 'string' && val.trim() !== '');

        setGatewayConfigs(prev => ({
            ...prev,
            [editingGateway]: {
                ...prev[editingGateway],
                credentials: currentCredentials,
                configured: isConfigured,
            }
        }));
        handleCancelEditing();
    };

    const handleCredentialChange = (field: string, value: string) => {
        setCurrentCredentials(prev => ({...prev, [field]: value}));
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Configurações e Integrações</h2>
            
            <div className="space-y-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2 mb-4">
                        <CreditCardIcon />
                        Gateways de Pagamento
                    </h3>
                    <p className="text-sm text-slate-600 mb-6">
                        Ative, desative e configure as credenciais dos seus gateways de pagamento.
                    </p>
                    <div className="space-y-4">
                        {gateways.map(gateway => (
                             <div key={gateway} className="p-4 border rounded-md transition-all duration-300">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        {gatewayConfigs[gateway].configured && <span title="Configurado"><CheckIcon className="text-green-500"/></span>}
                                        <span className="font-medium text-slate-700">{gateway}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                         <span className={`text-xs font-semibold ${gatewayConfigs[gateway].active ? 'text-green-600' : 'text-slate-500'}`}>
                                            {gatewayConfigs[gateway].active ? 'Ativo' : 'Inativo'}
                                        </span>
                                        <ToggleSwitch enabled={gatewayConfigs[gateway].active} onChange={() => handleToggleGateway(gateway)} />
                                        <button onClick={() => editingGateway === gateway ? handleCancelEditing() : handleStartEditing(gateway)} className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100">
                                            <EditIcon />
                                        </button>
                                    </div>
                                </div>

                                {editingGateway === gateway && (
                                    <div className="mt-4 pt-4 border-t space-y-3 animate-fade-in">
                                         <h4 className="text-sm font-semibold text-slate-600">Configurar {gateway}</h4>
                                         {Object.entries(getCredentialFields(gateway)).map(([key, label]) => (
                                            <div key={key}>
                                                <label htmlFor={key} className="block text-xs font-medium text-slate-500">{label}</label>
                                                <input
                                                    type="text"
                                                    id={key}
                                                    value={currentCredentials[key] || ''}
                                                    onChange={e => handleCredentialChange(key, e.target.value)}
                                                    className="mt-1 block w-full input-style"
                                                    placeholder={`Sua chave ${label}`}
                                                />
                                            </div>
                                         ))}
                                        <div className="flex justify-end gap-2">
                                            <button onClick={handleCancelEditing} className="px-3 py-1.5 text-sm bg-slate-200 text-slate-700 font-semibold rounded-md hover:bg-slate-300">Cancelar</button>
                                            <button onClick={handleSaveConfig} className="px-3 py-1.5 text-sm bg-green-600 text-white font-semibold rounded-md hover:bg-green-700">Salvar</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t">
                        <h4 className="text-md font-semibold text-slate-700">Métodos de Pagamento Aceitos</h4>
                        <p className="text-sm text-slate-600 mt-1 mb-4">
                            Estes são os métodos que seus clientes podem usar para pagar.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {paymentMethods.map(method => (
                                <span key={method} className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                                    {method}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                 <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2 mb-4">
                        <ApiIcon />
                        Gerenciador de API Gateway
                    </h3>
                    <p className="text-sm text-slate-600 mb-6">
                        Gerencie chaves de API, webhooks e acesse a documentação para integrações externas.
                    </p>
                    <ApiGatewayManager />
                </div>


                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                        <MailIcon />
                        Serviços de Notificação
                    </h3>
                    <p className="mt-2 text-slate-600">
                        Configure os serviços para envio de notificações por E-mail, SMS e WhatsApp.
                    </p>
                    <div className="mt-4">
                        <p className="text-sm text-slate-500">Modelos de mensagens personalizáveis para: confirmação de pagamento, lembretes de assinatura e status de entrega.</p>
                         <button className="mt-2 px-4 py-2 bg-slate-200 text-slate-700 font-semibold rounded-md hover:bg-slate-300">
                            Gerenciar Modelos
                        </button>
                    </div>
                </div>
            </div>
             <style>{`.input-style { border-radius: 0.375rem; border: 1px solid #cbd5e1; padding: 0.5rem 0.75rem; } .input-style:focus { outline: 2px solid transparent; outline-offset: 2px; box-shadow: 0 0 0 2px #22c55e; border-color: #22c55e; } @keyframes fade-in { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in { animation: fade-in 0.3s ease-out; }`}</style>
        </div>
    );
}
