import React, { useState, useEffect } from 'react';
import type { Product } from '../types';
import { GoogleGenAI } from "@google/genai";
import { SparklesIcon } from './icons/SparklesIcon';

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (productData: Product | Omit<Product, 'id'>) => void;
    product: Product | null; // null for creating, product object for editing
}

const emptyProduct: Omit<Product, 'id'> = {
    nome: '',
    descricao: '',
    preco: '',
    categoria: '',
    imagem: 'https://picsum.photos/seed/newproduct/400/300', // Default image
    vendedor: '',
    telefone: '',
    destaque: false,
    tags: [],
};

export function ProductFormModal({ isOpen, onClose, onSubmit, product }: ProductFormModalProps) {
    const [formData, setFormData] = useState<Product | Omit<Product, 'id'>>(product || emptyProduct);
    const [tagInput, setTagInput] = useState('');
    const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    
    useEffect(() => {
        // When the product prop changes, update the form data.
        const initialData = product ? { ...product, tags: product.tags || [] } : { ...emptyProduct, tags: [] };
        setFormData(initialData);
        setSuggestedTags([]); // Clear suggestions when modal opens for a new product
        setIsGenerating(false);
    }, [product, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
             const { checked } = e.target as HTMLInputElement;
             setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleAddTag = (tagToAdd: string) => {
        const newTag = tagToAdd.trim().toLowerCase();
        if (newTag && !(formData.tags ?? []).includes(newTag)) {
            setFormData(prev => ({ ...prev, tags: [...(prev.tags ?? []), newTag] }));
        }
        setTagInput('');
        // Remove the tag from suggestions if it was added
        setSuggestedTags(prev => prev.filter(t => t.toLowerCase() !== newTag));
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setFormData(prev => ({ ...prev, tags: (prev.tags ?? []).filter(tag => tag !== tagToRemove) }));
    };

    const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            handleAddTag(tagInput);
        }
    };

    const handleGenerateTags = async () => {
        if (!formData.nome || !formData.descricao) {
            alert('Por favor, preencha o nome e a descrição do produto para gerar tags.');
            return;
        }
        setIsGenerating(true);
        setSuggestedTags([]);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Baseado no nome "${formData.nome}" e na descrição "${formData.descricao}", sugira 5 tags de uma ou duas palavras, em português, separadas por vírgula, para categorizar este produto em um site de e-commerce. Não inclua a categoria "${formData.categoria}" nas tags. Retorne apenas as tags separadas por vírgula.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            const suggestions = response.text
                .split(',')
                .map(tag => tag.trim().toLowerCase())
                .filter(tag => tag && !(formData.tags ?? []).includes(tag)); // Filter out empty and existing tags
            
            setSuggestedTags(suggestions);

        } catch (error) {
            console.error("Erro ao gerar tags:", error);
            alert("Ocorreu um erro ao tentar sugerir tags. Tente novamente.");
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple validation
        if (!formData.nome || !formData.preco || !formData.categoria) {
            alert('Por favor, preencha os campos obrigatórios: Nome, Preço e Categoria.');
            return;
        }
        onSubmit(formData);
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start p-4 pt-16 sm:items-center" 
            aria-modal="true" 
            role="dialog"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()} // Prevent closing modal when clicking inside
            >
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">{product ? 'Editar Produto' : 'Adicionar Novo Produto'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Fields for nome, descricao, preco, etc. */}
                        <div>
                            <label htmlFor="nome" className="block text-sm font-medium text-slate-700">Nome do Produto</label>
                            <input type="text" name="nome" id="nome" value={formData.nome} onChange={handleChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500" required />
                        </div>
                        <div>
                            <label htmlFor="descricao" className="block text-sm font-medium text-slate-700">Descrição</label>
                            <textarea name="descricao" id="descricao" value={formData.descricao} onChange={handleChange} rows={3} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"></textarea>
                        </div>
                         <div>
                            <label htmlFor="preco" className="block text-sm font-medium text-slate-700">Preço (ex: R$ 40,00)</label>
                            <input type="text" name="preco" id="preco" value={formData.preco} onChange={handleChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500" required />
                        </div>
                        <div>
                            <label htmlFor="categoria" className="block text-sm font-medium text-slate-700">Categoria</label>
                            <input type="text" name="categoria" id="categoria" value={formData.categoria} onChange={handleChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500" required />
                        </div>

                        {/* TAGS SECTION */}
                        <div>
                            <div className="flex justify-between items-center">
                                <label htmlFor="tags" className="block text-sm font-medium text-slate-700">Tags</label>
                                <button
                                    type="button"
                                    onClick={handleGenerateTags}
                                    disabled={isGenerating}
                                    className="flex items-center gap-1.5 text-sm text-indigo-600 font-semibold hover:text-indigo-800 disabled:opacity-50 disabled:cursor-wait transition-colors"
                                >
                                    <SparklesIcon />
                                    {isGenerating ? 'Gerando...' : 'Sugerir com IA'}
                                </button>
                            </div>
                            <div className="mt-1 flex flex-wrap gap-2 items-center p-2 border border-slate-300 rounded-md">
                                {(formData.tags ?? []).map(tag => (
                                    <span key={tag} className="flex items-center gap-1.5 bg-green-100 text-green-800 text-sm font-medium px-2 py-0.5 rounded-full">
                                        {tag}
                                        <button type="button" onClick={() => handleRemoveTag(tag)} className="text-green-600 hover:text-green-800">&times;</button>
                                    </span>
                                ))}
                                <input
                                    type="text"
                                    id="tags"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleTagInputKeyDown}
                                    placeholder="Adicionar tag..."
                                    className="flex-grow p-1 outline-none bg-transparent"
                                />
                            </div>
                            {suggestedTags.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    <span className="text-sm text-slate-600 self-center">Sugestões:</span>
                                    {suggestedTags.map(tag => (
                                        <button
                                            key={tag}
                                            type="button"
                                            onClick={() => handleAddTag(tag)}
                                            className="text-xs font-semibold bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full hover:bg-indigo-200"
                                        >
                                           + {tag}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="imagem" className="block text-sm font-medium text-slate-700">URL da Imagem</label>
                            <input type="url" name="imagem" id="imagem" value={formData.imagem} onChange={handleChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500" />
                        </div>
                         <div>
                            <label htmlFor="vendedor" className="block text-sm font-medium text-slate-700">Vendedor</label>
                            <input type="text" name="vendedor" id="vendedor" value={formData.vendedor} onChange={handleChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500" />
                        </div>
                         <div>
                            <label htmlFor="telefone" className="block text-sm font-medium text-slate-700">Telefone (WhatsApp)</label>
                            <input type="text" name="telefone" id="telefone" value={formData.telefone} onChange={handleChange} placeholder="71999999999" className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500" />
                        </div>
                        <div className="flex items-center">
                            <input type="checkbox" name="destaque" id="destaque" checked={formData.destaque ?? false} onChange={handleChange} className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                            <label htmlFor="destaque" className="ml-2 block text-sm text-slate-900">Marcar como Destaque</label>
                        </div>

                        <div className="flex justify-end gap-4 pt-4 border-t mt-6">
                            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-700 font-semibold rounded-md hover:bg-slate-300">
                                Cancelar
                            </button>
                            <button type="submit" className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700">
                                Salvar Produto
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
