
import React, { useState, useMemo } from 'react';
import type { Product, Seller } from '../types';
import { ProductFormModal } from './ProductFormModal';
import { SellerFormModal } from './SellerFormModal';
import { ReportsDashboard } from './ReportsDashboard';
import { PlusIcon } from './icons/PlusIcon';
import { EditIcon } from './icons/EditIcon';
import { DeleteIcon } from './icons/DeleteIcon';
import { CheckIcon } from './icons/CheckIcon';
import { PackageIcon } from './icons/PackageIcon';
import { UsersIcon } from './icons/UsersIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
// FIX: Added import for GoogleGenAI
import { GoogleGenAI } from "@google/genai";

type Tab = 'products' | 'sellers' | 'reports';

export function AdminDashboard({
    initialProducts,
    initialSellers,
}: {
    initialProducts: Product[];
    initialSellers: Seller[];
}) {
    const [activeTab, setActiveTab] = useState<Tab>('reports');
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [sellers, setSellers] = useState<Seller[]>(initialSellers);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);
    const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
    const [sellerToEdit, setSellerToEdit] = useState<Seller | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    
    // FIX: Memoize GoogleGenAI client creation
    const ai = useMemo(() => {
        if (!process.env.API_KEY) {
            console.error("API_KEY environment variable is not set. AI features will be disabled.");
            return null;
        }
        return new GoogleGenAI({ apiKey: process.env.API_KEY });
    }, []);

    const handleGenerateDescription = async (productName: string) => {
        if (!ai) {
            alert('A funcionalidade de IA não está disponível. Verifique a configuração da chave de API.');
            return '';
        }
        setIsGenerating(true);
        try {
            // FIX: Correctly call generateContent with model and contents
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Gere uma descrição de produto curta e atrativa (máximo 2 frases) para um marketplace de produtos locais. O produto é: "${productName}". Foco em frescor, qualidade e origem local.`,
            });
            // FIX: Correctly access the generated text
            return response.text.trim();
        } catch (error) {
            console.error('Error generating description:', error);
            alert('Falha ao gerar descrição.');
            return '';
        } finally {
            setIsGenerating(false);
        }
    };
    
    // Product handlers
    const handleAddProduct = () => {
        setProductToEdit(null);
        setIsProductModalOpen(true);
    };

    const handleEditProduct = (product: Product) => {
        setProductToEdit(product);
        setIsProductModalOpen(true);
    };

    const handleDeleteProduct = (productId: string) => {
        if (window.confirm('Tem certeza que deseja excluir este produto?')) {
            setProducts(products.filter(p => p.id !== productId));
        }
    };

    const handleSaveProduct = (productData: Omit<Product, 'id' | 'rating'> & { id?: string }) => {
        if (productData.id) {
            setProducts(products.map(p => p.id === productData.id ? { ...p, ...productData } : p));
        } else {
            const newProduct: Product = {
                ...productData,
                id: `prod-${Date.now()}`,
                rating: 0, // New products start with 0 rating
            };
            setProducts([newProduct, ...products]);
        }
    };
    
    // Seller handlers
    const handleAddSeller = () => {
        setSellerToEdit(null);
        setIsSellerModalOpen(true);
    };

    const handleEditSeller = (seller: Seller) => {
        setSellerToEdit(seller);
        setIsSellerModalOpen(true);
    };

    const handleDeleteSeller = (sellerId: string) => {
        if (window.confirm('Tem certeza que deseja excluir este vendedor? Isso também removerá seus produtos.')) {
            setSellers(sellers.filter(s => s.id !== sellerId));
            setProducts(products.filter(p => p.sellerId !== sellerId));
        }
    };
    
    const handleSaveSeller = (sellerData: Omit<Seller, 'id' | 'dataCadastro' | 'rating'> & { id?: string }) => {
        if (sellerData.id) {
            setSellers(sellers.map(s => s.id === sellerData.id ? { ...s, ...sellerData } : s));
        } else {
            const newSeller: Seller = {
                ...sellerData,
                id: `seller-${Date.now()}`,
                dataCadastro: new Date().toISOString().split('T')[0],
                rating: 0,
            };
            setSellers([newSeller, ...sellers]);
        }
    };

    const handleApproveSeller = (sellerId: string) => {
        setSellers(sellers.map(s => s.id === sellerId ? { ...s, status: 'Aprovado' } : s));
    };
    
    const renderTabContent = () => {
        switch (activeTab) {
            case 'products':
                return (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-slate-800">Gerenciar Produtos</h2>
                            <button onClick={handleAddProduct} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700">
                                <PlusIcon /> Novo Produto
                            </button>
                        </div>
                        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                            <table className="w-full text-sm text-left text-slate-500">
                                <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Produto</th>
                                        <th scope="col" className="px-6 py-3">Vendedor</th>
                                        <th scope="col" className="px-6 py-3">Preço</th>
                                        <th scope="col" className="px-6 py-3">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(p => (
                                        <tr key={p.id} className="bg-white border-b hover:bg-slate-50">
                                            <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{p.name}</th>
                                            <td className="px-6 py-4">{p.sellerName}</td>
                                            <td className="px-6 py-4">R$ {p.price.toFixed(2)}</td>
                                            <td className="px-6 py-4 flex gap-3">
                                                <button onClick={() => handleEditProduct(p)} title="Editar" className="text-blue-600 hover:text-blue-800"><EditIcon /></button>
                                                <button onClick={() => handleDeleteProduct(p.id)} title="Excluir" className="text-red-600 hover:text-red-800"><DeleteIcon /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'sellers':
                return (
                    <div>
                         <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-slate-800">Gerenciar Vendedores</h2>
                            <button onClick={handleAddSeller} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700">
                                <PlusIcon /> Novo Vendedor
                            </button>
                        </div>
                        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                           <table className="w-full text-sm text-left text-slate-500">
                                <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Negócio</th>
                                        <th scope="col" className="px-6 py-3">Responsável</th>
                                        <th scope="col" className="px-6 py-3">Status</th>
                                        <th scope="col" className="px-6 py-3">Data Cadastro</th>
                                        <th scope="col" className="px-6 py-3">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sellers.map(s => (
                                        <tr key={s.id} className="bg-white border-b hover:bg-slate-50">
                                            <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{s.nomeNegocio}</th>
                                            <td className="px-6 py-4">{s.nomeCompleto}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${s.status === 'Aprovado' ? 'bg-green-100 text-green-800' : s.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                                    {s.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">{new Date(s.dataCadastro).toLocaleDateString('pt-BR')}</td>
                                            <td className="px-6 py-4 flex gap-3">
                                                {s.status === 'Pendente' && <button onClick={() => handleApproveSeller(s.id)} title="Aprovar" className="text-green-600 hover:text-green-800"><CheckIcon /></button>}
                                                <button onClick={() => handleEditSeller(s)} title="Editar" className="text-blue-600 hover:text-blue-800"><EditIcon /></button>
                                                <button onClick={() => handleDeleteSeller(s.id)} title="Excluir" className="text-red-600 hover:text-red-800"><DeleteIcon /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'reports':
                return <ReportsDashboard products={products} sellers={sellers} />;
        }
    };
    
    const TabButton: React.FC<{tab: Tab; label: string; icon: React.ReactNode}> = ({ tab, label, icon }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab 
                ? 'bg-green-600 text-white' 
                : 'text-slate-600 hover:bg-slate-200'
            }`}
        >
            {icon} {label}
        </button>
    );

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Painel do Administrador</h1>
            
            <div className="flex space-x-2 border-b mb-6 overflow-x-auto pb-2">
                <TabButton tab="reports" label="Relatórios" icon={<ChartBarIcon />} />
                <TabButton tab="products" label="Produtos" icon={<PackageIcon />} />
                <TabButton tab="sellers" label="Vendedores" icon={<UsersIcon />} />
            </div>
            
            <div>
                {renderTabContent()}
            </div>

            <ProductFormModal
                isOpen={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                onSave={handleSaveProduct}
                productToEdit={productToEdit}
                sellers={sellers}
                onGenerateDescription={handleGenerateDescription}
                isGenerating={isGenerating}
            />

             <SellerFormModal
                isOpen={isSellerModalOpen}
                onClose={() => setIsSellerModalOpen(false)}
                onSave={handleSaveSeller}
                sellerToEdit={sellerToEdit}
            />
        </div>
    );
}
