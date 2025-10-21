import React, { useState, useEffect } from 'react';
import type { Product, Seller } from '../types';
import { XCircleIcon } from './icons/XCircleIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (product: Omit<Product, 'id' | 'rating'> & { id?: string }) => void;
    productToEdit: Product | null;
    sellers: Seller[];
    onGenerateDescription?: (productName: string) => Promise<string>;
    isGenerating?: boolean;
    themeColor: string;
}

export function ProductFormModal({ isOpen, onClose, onSave, productToEdit, sellers, onGenerateDescription, isGenerating, themeColor }: ProductFormModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [category, setCategory] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [sellerId, setSellerId] = useState('');
    const [stock, setStock] = useState(0);

    useEffect(() => {
        if (productToEdit) {
            setName(productToEdit.name);
            setDescription(productToEdit.description);
            setPrice(productToEdit.price);
            setCategory(productToEdit.category);
            setImageUrl(productToEdit.imageUrl);
            setSellerId(productToEdit.sellerId);
            setStock(productToEdit.stock);
        } else {
            // Reset form
            setName('');
            setDescription('');
            setPrice(0);
            setCategory('');
            setImageUrl('');
            setSellerId('');
            setStock(0);
        }
    }, [productToEdit, isOpen]);

    const handleGenerateClick = async () => {
        if (onGenerateDescription && name) {
            const generatedDesc = await onGenerateDescription(name);
            if (generatedDesc) {
                setDescription(generatedDesc);
            }
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const seller = sellers.find(s => s.id === sellerId);
        if (!seller) {
            alert("Selecione um vendedor válido.");
            return;
        }

        onSave({
            id: productToEdit?.id,
            name,
            description,
            price,
            category,
            imageUrl,
            sellerId,
            sellerName: seller.nomeNegocio,
            stock,
        });
        onClose();
    };

    if (!isOpen) return null;

    const inputClasses = `mt-1 block w-full border border-slate-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-${themeColor}-500 focus:border-transparent`;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-slate-800">{productToEdit ? 'Editar Produto' : 'Novo Produto'}</h2>
                        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
                           <XCircleIcon />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700">Nome do Produto</label>
                            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className={inputClasses} />
                        </div>
                        <div>
                             <div className="flex justify-between items-center">
                                <label htmlFor="description" className="block text-sm font-medium text-slate-700">Descrição</label>
                                {onGenerateDescription && (
                                    <button 
                                        type="button" 
                                        onClick={handleGenerateClick}
                                        disabled={isGenerating || !name}
                                        className={`flex items-center gap-1 text-xs text-${themeColor}-600 font-semibold hover:text-${themeColor}-800 disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        <SparklesIcon />
                                        {isGenerating ? 'Gerando...' : 'Gerar com IA'}
                                    </button>
                                )}
                            </div>
                            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required rows={3} className={inputClasses}></textarea>
                        </div>
                         <div>
                            <label htmlFor="seller" className="block text-sm font-medium text-slate-700">Vendedor</label>
                            <select id="seller" value={sellerId} onChange={e => setSellerId(e.target.value)} required className={inputClasses}>
                                <option value="" disabled>Selecione um vendedor</option>
                                {sellers.filter(s => s.status === 'Aprovado').map(seller => (
                                    <option key={seller.id} value={seller.id}>{seller.nomeNegocio}</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="price" className="block text-sm font-medium text-slate-700">Preço (R$)</label>
                                <input type="number" id="price" value={price} onChange={e => setPrice(Number(e.target.value))} required min="0" step="0.01" className={inputClasses} />
                            </div>
                             <div>
                                <label htmlFor="stock" className="block text-sm font-medium text-slate-700">Estoque</label>
                                <input type="number" id="stock" value={stock} onChange={e => setStock(Number(e.target.value))} required min="0" className={inputClasses} />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-slate-700">Categoria</label>
                            <input type="text" id="category" value={category} onChange={e => setCategory(e.target.value)} required className={inputClasses} />
                        </div>
                        <div>
                            <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-700">URL da Imagem</label>
                            <input type="url" id="imageUrl" value={imageUrl} onChange={e => setImageUrl(e.target.value)} required className={inputClasses} />
                        </div>
                    </div>

                    <div className="flex justify-end pt-6 mt-6 border-t gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-700 font-semibold rounded-md hover:bg-slate-300">
                            Cancelar
                        </button>
                        <button type="submit" className={`px-4 py-2 bg-${themeColor}-600 text-white font-semibold rounded-md hover:bg-${themeColor}-700`}>
                            Salvar Produto
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}