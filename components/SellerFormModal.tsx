import React, { useState, useEffect } from 'react';
// FIX: Import the 'Product' type.
import type { Seller, Plan, SubscriptionStatus, Product } from '../types';
import { PLAN_DETAILS } from '../constants';

interface SellerFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (sellerData: Seller | Omit<Seller, 'id'>) => void;
    seller: Seller | null;
    products: Product[]; // Needed to check product limits
}

const emptySeller: Omit<Seller, 'id'> = {
    nomeCompleto: '',
    cpfCnpj: '',
    telefone: '',
    email: '',
    enderecoCompleto: '',
    categoriaDeProduto: '',
    status: 'Pendente',
    plan: 'Básico',
    subscriptionStatus: 'Ativa',
    vencimentoAssinatura: new Date().toISOString().split('T')[0],
};

export function SellerFormModal({ isOpen, onClose, onSubmit, seller, products }: SellerFormModalProps) {
    const [formData, setFormData] = useState<Seller | Omit<Seller, 'id'>>(seller || emptySeller);

    useEffect(() => {
        setFormData(seller || emptySeller);
    }, [seller, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.nomeCompleto || !formData.email) {
            alert('Por favor, preencha os campos obrigatórios: Nome Completo e E-mail.');
            return;
        }
        onSubmit(formData);
    };

    const sellerProductCount = products.filter(p => p.vendedor === formData.nomeCompleto).length;
    const exceedsLimit = formData.plan === 'Básico' && sellerProductCount > PLAN_DETAILS['Básico'].productLimit;


    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start p-4 pt-16 sm:items-center" 
            aria-modal="true" 
            role="dialog"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="text-2xl font-bold mb-6">{seller ? 'Editar Vendedor' : 'Adicionar Novo Vendedor'}</h2>
                    
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-600 border-b pb-2">Informações do Perfil</h3>
                        <div>
                            <label htmlFor="nomeCompleto" className="block text-sm font-medium text-slate-700">Nome Completo</label>
                            <input type="text" name="nomeCompleto" id="nomeCompleto" value={formData.nomeCompleto} onChange={handleChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500" required />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700">E-mail</label>
                                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500" required />
                            </div>
                             <div>
                                <label htmlFor="telefone" className="block text-sm font-medium text-slate-700">Telefone</label>
                                <input type="tel" name="telefone" id="telefone" value={formData.telefone} onChange={handleChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="cpfCnpj" className="block text-sm font-medium text-slate-700">CPF/CNPJ</label>
                            <input type="text" name="cpfCnpj" id="cpfCnpj" value={formData.cpfCnpj} onChange={handleChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500" />
                        </div>
                        <div>
                            <label htmlFor="enderecoCompleto" className="block text-sm font-medium text-slate-700">Endereço Completo</label>
                            <input type="text" name="enderecoCompleto" id="enderecoCompleto" value={formData.enderecoCompleto} onChange={handleChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500" />
                        </div>
                         <div>
                            <label htmlFor="categoriaDeProduto" className="block text-sm font-medium text-slate-700">Categoria Principal</label>
                            <input type="text" name="categoriaDeProduto" id="categoriaDeProduto" value={formData.categoriaDeProduto} onChange={handleChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500" />
                        </div>
                        
                        <h3 className="text-lg font-semibold text-slate-600 border-b pb-2 pt-4">Assinatura e Status</h3>
                         {exceedsLimit && (
                            <div className="p-3 bg-red-100 text-red-800 rounded-md text-sm">
                                <strong>Atenção:</strong> Este vendedor está no plano Básico e excedeu o limite de produtos ({sellerProductCount}/{PLAN_DETAILS['Básico'].productLimit}). Recomenda-se o upgrade para o plano Premium.
                            </div>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="plan" className="block text-sm font-medium text-slate-700">Plano</label>
                                <select name="plan" id="plan" value={formData.plan} onChange={handleChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500">
                                    <option value="Básico">Básico</option>
                                    <option value="Premium">Premium</option>
                                </select>
                            </div>
                             <div>
                                <label htmlFor="subscriptionStatus" className="block text-sm font-medium text-slate-700">Status da Assinatura</label>
                                <select name="subscriptionStatus" id="subscriptionStatus" value={formData.subscriptionStatus} onChange={handleChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500">
                                    <option value="Ativa">Ativa</option>
                                    <option value="Atrasada">Atrasada</option>
                                    <option value="Cancelada">Cancelada</option>
                                </select>
                            </div>
                        </div>
                         <div>
                            <label htmlFor="vencimentoAssinatura" className="block text-sm font-medium text-slate-700">Vencimento da Assinatura</label>
                            <input type="date" name="vencimentoAssinatura" id="vencimentoAssinatura" value={formData.vencimentoAssinatura} onChange={handleChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500" />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-6 border-t mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-700 font-semibold rounded-md hover:bg-slate-300">
                            Cancelar
                        </button>
                        <button type="submit" className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700">
                            Salvar Alterações
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}