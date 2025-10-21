import React, { useState, useEffect } from 'react';
import type { Seller } from '../types';
import { XCircleIcon } from './icons/XCircleIcon';
import { getThemeClasses } from '../utils/theme';

interface SellerFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (seller: Omit<Seller, 'id' | 'dataCadastro' | 'rating'> & { id?: string }) => void;
    sellerToEdit: Seller | null;
    themeColor: string;
}

export function SellerFormModal({ isOpen, onClose, onSave, sellerToEdit, themeColor }: SellerFormModalProps) {
    const [nomeCompleto, setNomeCompleto] = useState('');
    const [nomeNegocio, setNomeNegocio] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [status, setStatus] = useState<'Aprovado' | 'Pendente' | 'Rejeitado'>('Pendente');
    const [subscriptionStatus, setSubscriptionStatus] = useState<'Ativa' | 'Inativa'>('Inativa');
    const theme = getThemeClasses(themeColor);

    useEffect(() => {
        if (sellerToEdit) {
            setNomeCompleto(sellerToEdit.nomeCompleto);
            setNomeNegocio(sellerToEdit.nomeNegocio);
            setEmail(sellerToEdit.email);
            setTelefone(sellerToEdit.telefone);
            setCnpj(sellerToEdit.cnpj);
            setStatus(sellerToEdit.status);
            setSubscriptionStatus(sellerToEdit.subscriptionStatus);
        } else {
            // Reset form
            setNomeCompleto('');
            setNomeNegocio('');
            setEmail('');
            setTelefone('');
            setCnpj('');
            setStatus('Pendente');
            setSubscriptionStatus('Inativa');
        }
    }, [sellerToEdit, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: sellerToEdit?.id,
            nomeCompleto,
            nomeNegocio,
            email,
            telefone,
            cnpj,
            status,
            subscriptionStatus
        });
        onClose();
    };

    if (!isOpen) return null;

    const inputClasses = `mt-1 block w-full border border-slate-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 ${theme.focusRing500} focus:border-transparent`;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-slate-800">{sellerToEdit ? 'Editar Vendedor' : 'Novo Vendedor'}</h2>
                        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
                           <XCircleIcon />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="nomeCompleto" className="block text-sm font-medium text-slate-700">Nome Completo</label>
                            <input type="text" id="nomeCompleto" value={nomeCompleto} onChange={e => setNomeCompleto(e.target.value)} required className={inputClasses} />
                        </div>
                        <div>
                            <label htmlFor="nomeNegocio" className="block text-sm font-medium text-slate-700">Nome do Negócio</label>
                            <input type="text" id="nomeNegocio" value={nomeNegocio} onChange={e => setNomeNegocio(e.target.value)} required className={inputClasses} />
                        </div>
                         <div>
                            <label htmlFor="cnpj" className="block text-sm font-medium text-slate-700">CNPJ</label>
                            <input type="text" id="cnpj" value={cnpj} onChange={e => setCnpj(e.target.value)} required placeholder="12.345.678/0001-99" className={inputClasses} />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">E-mail</label>
                            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className={inputClasses} />
                        </div>
                        <div>
                            <label htmlFor="telefone" className="block text-sm font-medium text-slate-700">Telefone (WhatsApp)</label>
                            <input type="tel" id="telefone" value={telefone} onChange={e => setTelefone(e.target.value)} required placeholder="75999998888" className={inputClasses} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="status" className="block text-sm font-medium text-slate-700">Status do Cadastro</label>
                                <select id="status" value={status} onChange={e => setStatus(e.target.value as any)} required className={inputClasses}>
                                    <option value="Pendente">Pendente</option>
                                    <option value="Aprovado">Aprovado</option>
                                    <option value="Rejeitado">Rejeitado</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="subscriptionStatus" className="block text-sm font-medium text-slate-700">Status da Assinatura</label>
                                <select id="subscriptionStatus" value={subscriptionStatus} onChange={e => setSubscriptionStatus(e.target.value as any)} required className={inputClasses}>
                                    <option value="Ativa">Ativa</option>
                                    <option value="Inativa">Inativa</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-6 mt-6 border-t gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-700 font-semibold rounded-md hover:bg-slate-300">
                            Cancelar
                        </button>
                        <button type="submit" className={`px-4 py-2 ${theme.bg600} text-white font-semibold rounded-md ${theme.hoverBg700}`}>
                            Salvar Vendedor
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
