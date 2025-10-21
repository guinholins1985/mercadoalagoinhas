import React, { useState } from 'react';
import { PlusIcon } from './icons/PlusIcon';
import { EditIcon } from './icons/EditIcon';
import { DeleteIcon } from './icons/DeleteIcon';
import { CheckIcon } from './icons/CheckIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { getThemeClasses } from '../utils/theme';

type ApiKey = {
    id: string;
    name: string;
    key: string;
    status: 'Ativa' | 'Inativa';
    createdAt: string;
};

type Webhook = {
    id: string;
    url: string;
    events: string[];
    status: 'Ativo' | 'Inativo';
};

const initialApiKeys: ApiKey[] = [
    { id: 'key_1', name: 'Integração ERP', key: 'sk_live_******************1234', status: 'Ativa', createdAt: '2023-05-20' },
    { id: 'key_2', name: 'App Mobile (iOS)', key: 'sk_live_******************5678', status: 'Ativa', createdAt: '2023-07-11' },
    { id: 'key_3', name: 'Chave Antiga', key: 'sk_live_******************abcd', status: 'Inativa', createdAt: '2022-11-30' },
];

const initialWebhooks: Webhook[] = [
    { id: 'wh_1', url: 'https://api.meuerp.com/webhooks/pagamentos', events: ['payment.confirmed', 'payment.failed'], status: 'Ativo' },
    { id: 'wh_2', url: 'https://api.meusistema.com/notificacoes', events: ['subscription.canceled', 'chargeback.registered'], status: 'Ativo' },
];

const CodeSnippet: React.FC<{ language: string; code: string }> = ({ language, code }) => (
    <div>
        <h5 className="text-sm font-semibold text-slate-600 mb-1">{language}</h5>
        <pre className="bg-slate-800 text-white p-3 rounded-md text-xs overflow-x-auto">
            <code>{code}</code>
        </pre>
    </div>
);

// Vercel/Tailwind JIT Fix: This component ensures that all Tailwind classes are static strings.
const ApiKeyStatusBadge: React.FC<{ status: ApiKey['status']; themeColor: string }> = ({ status, themeColor }) => {
    const baseClasses = "px-2 py-0.5 text-xs rounded-full";

    if (status === 'Inativa') {
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>{status}</span>;
    }

    // Handle 'Ativa' status with theme-sensitive colors
    switch (themeColor) {
        case 'green':
            return <span className={`${baseClasses} bg-green-100 text-green-800`}>{status}</span>;
        case 'blue':
            return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>{status}</span>;
        case 'orange':
            return <span className={`${baseClasses} bg-orange-100 text-orange-800`}>{status}</span>;
        case 'purple':
            return <span className={`${baseClasses} bg-purple-100 text-purple-800`}>{status}</span>;
        case 'pink':
            return <span className={`${baseClasses} bg-pink-100 text-pink-800`}>{status}</span>;
        default:
            return <span className={`${baseClasses} bg-green-100 text-green-800`}>{status}</span>;
    }
};

export function ApiGatewayManager({ themeColor }: { themeColor: string }) {
    const [apiKeys, setApiKeys] = useState(initialApiKeys);
    const [webhooks, setWebhooks] = useState(initialWebhooks);
    const theme = getThemeClasses(themeColor);

    // Editing states
    const [editingKeyId, setEditingKeyId] = useState<string | null>(null);
    const [keyNameInput, setKeyNameInput] = useState('');
    const [editingWebhookId, setEditingWebhookId] = useState<string | null>(null);
    const [webhookUrlInput, setWebhookUrlInput] = useState('');
    const [webhookEventsInput, setWebhookEventsInput] = useState('');
    const [isAddingWebhook, setIsAddingWebhook] = useState(false);
    const [newWebhookUrl, setNewWebhookUrl] = useState('');
    const [newWebhookEvents, setNewWebhookEvents] = useState('');

    const handleGenerateKey = () => {
        const newKey: ApiKey = {
            id: `key_${Date.now()}`,
            name: 'Nova Chave (edite)',
            key: `sk_live_******************${Math.random().toString(36).substring(2, 6)}`,
            status: 'Ativa',
            createdAt: new Date().toISOString().split('T')[0],
        };
        setApiKeys([newKey, ...apiKeys]);
    };

    const handleRevokeKey = (id: string) => {
        if (window.confirm('Tem certeza que deseja revogar esta chave? Ela será desativada permanentemente.')) {
            setApiKeys(apiKeys.map(k => k.id === id ? { ...k, status: 'Inativa' } : k));
        }
    };
    
    const handleEditKey = (key: ApiKey) => {
        setEditingKeyId(key.id);
        setKeyNameInput(key.name);
    };

    const handleCancelEditKey = () => {
        setEditingKeyId(null);
        setKeyNameInput('');
    };

    const handleSaveKey = (id: string) => {
        setApiKeys(apiKeys.map(k => k.id === id ? { ...k, name: keyNameInput } : k));
        handleCancelEditKey();
    };

    const handleEditWebhook = (webhook: Webhook) => {
        setEditingWebhookId(webhook.id);
        setWebhookUrlInput(webhook.url);
        setWebhookEventsInput(webhook.events.join(', '));
    };
    
    const handleCancelEditWebhook = () => {
        setEditingWebhookId(null);
        setWebhookUrlInput('');
        setWebhookEventsInput('');
    };

    const handleSaveWebhook = (id: string) => {
        setWebhooks(webhooks.map(wh => wh.id === id ? { ...wh, url: webhookUrlInput, events: webhookEventsInput.split(',').map(e => e.trim()).filter(Boolean) } : wh));
        handleCancelEditWebhook();
    };
    
    const handleDeleteWebhook = (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este webhook?')) {
            setWebhooks(webhooks.filter(wh => wh.id !== id));
        }
    };

    const handleAddWebhook = () => {
        if (!newWebhookUrl) return alert('URL do webhook é obrigatória.');
        const newWebhook: Webhook = {
            id: `wh_${Date.now()}`,
            url: newWebhookUrl,
            events: newWebhookEvents.split(',').map(e => e.trim()).filter(Boolean),
            status: 'Ativo',
        };
        setWebhooks([newWebhook, ...webhooks]);
        setIsAddingWebhook(false);
        setNewWebhookUrl('');
        setNewWebhookEvents('');
    };

    const inputClasses = `border border-slate-300 rounded-md shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 ${theme.focusRing500} focus:border-transparent`;

    return (
        <div className="space-y-8 pt-6 border-t">
            {/* API Keys Section */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-md font-semibold text-slate-700">Chaves de API</h4>
                    <button onClick={handleGenerateKey} className={`flex items-center gap-1 px-3 py-1.5 ${theme.bg600} text-white text-sm font-semibold rounded-md ${theme.hoverBg700}`}>
                        <PlusIcon /> Gerar Chave
                    </button>
                </div>
                <div className="overflow-x-auto border rounded-lg bg-white">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-xs text-slate-600 uppercase">
                            <tr>
                                <th className="px-4 py-2">Nome</th>
                                <th className="px-4 py-2">Chave</th>
                                <th className="px-4 py-2">Status</th>
                                <th className="px-4 py-2 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-700">
                            {apiKeys.map(key => (
                                <tr key={key.id} className="border-t">
                                    <td className="px-4 py-2 font-medium whitespace-nowrap">
                                        {editingKeyId === key.id ? (
                                             <input type="text" value={keyNameInput} onChange={e => setKeyNameInput(e.target.value)} className={`${inputClasses} w-48`}/>
                                        ) : (
                                            key.name
                                        )}
                                    </td>
                                    <td className="px-4 py-2 font-mono text-xs">{key.key}</td>
                                    <td className="px-4 py-2">
                                        <ApiKeyStatusBadge status={key.status} themeColor={themeColor} />
                                    </td>
                                    <td className="px-4 py-2 text-right">
                                         <div className="flex items-center justify-end gap-3">
                                            {editingKeyId === key.id ? (
                                                <>
                                                    <button onClick={() => handleSaveKey(key.id)} title="Salvar" className="text-green-600 hover:text-green-800"><CheckIcon/></button>
                                                    <button onClick={handleCancelEditKey} title="Cancelar" className="text-slate-500 hover:text-slate-700"><XCircleIcon/></button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => handleEditKey(key)} title="Editar Nome" className="text-blue-600 hover:text-blue-800"><EditIcon/></button>
                                                    {key.status === 'Ativa' && (
                                                        <button onClick={() => handleRevokeKey(key.id)} title="Revogar Chave" className="text-red-600 hover:text-red-800">
                                                            <DeleteIcon />
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Webhooks Section */}
            <div>
                 <h4 className="text-md font-semibold text-slate-700 mb-4">Webhooks</h4>
                 <div className="overflow-x-auto border rounded-lg bg-white">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-xs text-slate-600 uppercase">
                            <tr>
                                <th className="px-4 py-2">URL do Endpoint</th>
                                <th className="px-4 py-2">Eventos</th>
                                <th className="px-4 py-2 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-700">
                            {webhooks.map(wh => (
                                <tr key={wh.id} className="border-t">
                                    <td className="px-4 py-2 font-mono text-xs">
                                        {editingWebhookId === wh.id ? (
                                             <input type="text" value={webhookUrlInput} onChange={e => setWebhookUrlInput(e.target.value)} className={`${inputClasses} w-full`}/>
                                        ) : (
                                            wh.url
                                        )}
                                    </td>
                                    <td className="px-4 py-2 align-top">
                                         {editingWebhookId === wh.id ? (
                                             <input type="text" value={webhookEventsInput} onChange={e => setWebhookEventsInput(e.target.value)} className={`${inputClasses} w-full`} placeholder="payment.confirmed, payment.failed"/>
                                        ) : (
                                            <div className="flex flex-wrap gap-1">
                                                {wh.events.map(event => (
                                                    <span key={event} className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                                                        {event}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 text-right">
                                         <div className="flex items-center justify-end gap-3">
                                            {editingWebhookId === wh.id ? (
                                                <>
                                                    <button onClick={() => handleSaveWebhook(wh.id)} title="Salvar" className="text-green-600 hover:text-green-800"><CheckIcon/></button>
                                                    <button onClick={handleCancelEditWebhook} title="Cancelar" className="text-slate-500 hover:text-slate-700"><XCircleIcon/></button>
                                                </>
                                            ) : (
                                                 <>
                                                    <button onClick={() => handleEditWebhook(wh)} title="Editar" className="text-blue-600 hover:text-blue-800"><EditIcon/></button>
                                                    <button onClick={() => handleDeleteWebhook(wh.id)} title="Excluir" className="text-red-600 hover:text-red-800"><DeleteIcon/></button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {isAddingWebhook && (
                        <div className="p-4 bg-slate-50 border-t">
                             <h5 className="text-sm font-semibold text-slate-700 mb-2">Adicionar Novo Webhook</h5>
                             <div className="space-y-3">
                                <input type="text" value={newWebhookUrl} onChange={e => setNewWebhookUrl(e.target.value)} placeholder="https://api.seu-servico.com/webhook" className={`${inputClasses} w-full`}/>
                                <input type="text" value={newWebhookEvents} onChange={e => setNewWebhookEvents(e.target.value)} placeholder="Eventos (separados por vírgula), ex: payment.confirmed" className={`${inputClasses} w-full`}/>
                                <div className="flex justify-end gap-2">
                                     <button onClick={() => setIsAddingWebhook(false)} className="px-3 py-1.5 text-sm bg-slate-200 text-slate-700 font-semibold rounded-md hover:bg-slate-300">Cancelar</button>
                                    <button onClick={handleAddWebhook} className={`px-3 py-1.5 text-sm ${theme.bg600} text-white font-semibold rounded-md ${theme.hoverBg700}`}>Salvar Webhook</button>
                                </div>
                             </div>
                        </div>
                    )}
                </div>
                 {!isAddingWebhook && (
                    <div className="mt-4">
                        <button onClick={() => setIsAddingWebhook(true)} className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700">
                           <PlusIcon /> Adicionar Webhook
                        </button>
                    </div>
                 )}
            </div>

            {/* Documentation Section */}
            <div>
                <h4 className="text-md font-semibold text-slate-700 mb-4">Documentação da API</h4>
                 <div className="space-y-4">
                    <CodeSnippet language="JavaScript (Fetch)" code={`fetch('https://api.mercadoalagoinhas.com/v1/payments', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk_live_...',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ amount: 1000, currency: 'brl' })
});`} />
                     <CodeSnippet language="Python (Requests)" code={`import requests

headers = {'Authorization': 'Bearer sk_live_...'}
data = {'amount': 1000, 'currency': 'brl'}
response = requests.post(
    'https://api.mercadoalagoinhas.com/v1/payments', 
    headers=headers, 
    json=data
)`} />
                     <CodeSnippet language="PHP (cURL)" code={`$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://api.mercadoalagoinhas.com/v1/payments");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Authorization: Bearer sk_live_...'));
// ...
curl_exec($ch);`} />
                </div>
            </div>
        </div>
    );
}