import React, { useState, useMemo } from 'react';
import type { Product, Seller, Transaction } from '../types';
import { ProductFormModal } from './ProductFormModal';
import { SellerFormModal } from './SellerFormModal';
import { ReportsDashboard } from './ReportsDashboard';
import { FinancialDashboard } from './FinancialDashboard';
import { SettingsDashboard } from './SettingsDashboard';
import { AppearanceDashboard } from './AppearanceDashboard';
import { PlusIcon } from './icons/PlusIcon';
import { EditIcon } from './icons/EditIcon';
import { DeleteIcon } from './icons/DeleteIcon';
import { CheckIcon } from './icons/CheckIcon';
import { PackageIcon } from './icons/PackageIcon';
import { UsersIcon } from './icons/UsersIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { CreditCardIcon } from './icons/CreditCardIcon';
import { CogIcon } from './icons/CogIcon';
import { EyeIcon } from './icons/EyeIcon';
import { GoogleGenAI } from "@google/genai";
import { TRANSACTIONS } from '../constants'; // Import mock transactions


type Tab = 'overview' | 'products' | 'sellers' | 'financial' | 'appearance' | 'settings';

export function AdminDashboard({
    initialProducts,
    initialSellers,
    bannerImages,
    onBannerImagesChange,
    storeName,
    onStoreNameChange,
    themeColor,
    onThemeColorChange,
}: {
    initialProducts: Product[];
    initialSellers: Seller[];
    bannerImages: string[];
    onBannerImagesChange: (images: string[]) => void;
    storeName: string;
    onStoreNameChange: (name: string) => void;
    themeColor: string;
    onThemeColorChange: (color: string) => void;
}) {
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [sellers, setSellers] = useState<Seller[]>(initialSellers);
    const [transactions] = useState<Transaction[]>(TRANSACTIONS);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);
    const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
    const [sellerToEdit, setSellerToEdit] = useState<Seller | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    
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
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Gere uma descrição de produto curta e atrativa (máximo 2 frases) para um marketplace de produtos locais. O produto é: "${productName}". Foco em frescor, qualidade e origem local.`,
            });
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
                rating: 0, 
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
            case 'overview':
                return <ReportsDashboard products={products} sellers={sellers} themeColor={themeColor}/>;
            case 'products':
                return (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-slate-800">Gerenciar Produtos</h2>
                            <button onClick={handleAddProduct} className={`flex items-center gap-2 px-4 py-2 bg-${themeColor}-600 text-white font-semibold rounded-md hover:bg-${themeColor}-700`}>
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
                                        <th scope="col" className="px-6 py-3">Estoque</th>
                                        <th scope="col" className="px-6 py-3">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(p => (
                                        <tr key={p.id} className="bg-white border-b hover:bg-slate-50">
                                            <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{p.name}</th>
                                            <td className="px-6 py-4">{p.sellerName}</td>
                                            <td className="px-6 py-4">R$ {p.price.toFixed(2)}</td>
                                            <td className="px-6 py-4">{p.stock}</td>
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
                            <button onClick={handleAddSeller} className={`flex items-center gap-2 px-4 py-2 bg-${themeColor}-600 text-white font-semibold rounded-md hover:bg-${themeColor}-700`}>
                                <PlusIcon /> Novo Vendedor
                            </button>
                        </div>
                        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                           <table className="w-full text-sm text-left text-slate-500">
                                <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Negócio</th>
                                        <th scope="col" className="px-6 py-3">CNPJ</th>
                                        <th scope="col" className="px-6 py-3">Status</th>
                                        <th scope="col" className="px-6 py-3">Data Cadastro</th>
                                        <th scope="col" className="px-6 py-3">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sellers.map(s => (
                                        <tr key={s.id} className="bg-white border-b hover:bg-slate-50">
                                            <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{s.nomeNegocio}</th>
                                            <td className="px-6 py-4">{s.cnpj}</td>
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
            case 'financial':
                return <FinancialDashboard transactions={transactions} themeColor={themeColor} />;
            case 'appearance':
                return <AppearanceDashboard
                    bannerImages={bannerImages}
                    onBannerImagesChange={onBannerImagesChange}
                    storeName={storeName}
                    onStoreNameChange={onStoreNameChange}
                    themeColor={themeColor}
                    onThemeColorChange={onThemeColorChange}
                />;
            case 'settings':
                return <SettingsDashboard themeColor={themeColor} />;
        }
    };
    
    const TabButton: React.FC<{tab: Tab; label: string; icon: React.ReactNode}> = ({ tab, label, icon }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                activeTab === tab 
                ? `bg-${themeColor}-600 text-white shadow-sm` 
                : 'text-slate-600 hover:bg-slate-200'
            }`}
        >
            {icon} {label}
        </button>
    );

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Painel do Administrador</h1>
            
            <div className="flex space-x-2 border-b mb-6 overflow-x-auto pb-2 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
                <TabButton tab="overview" label="Visão Geral" icon={<ChartBarIcon className="h-5 w-5"/>} />
                <TabButton tab="products" label="Produtos" icon={<PackageIcon className="h-5 w-5"/>} />
                <TabButton tab="sellers" label="Vendedores" icon={<UsersIcon className="h-5 w-5"/>} />
                <TabButton tab="financial" label="Financeiro" icon={<CreditCardIcon className="h-5 w-5"/>} />
                <TabButton tab="appearance" label="Aparência" icon={<EyeIcon className="h-5 w-5"/>} />
                <TabButton tab="settings" label="Configurações" icon={<CogIcon className="h-5 w-5"/>} />
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
                themeColor={themeColor}
            />

             <SellerFormModal
                isOpen={isSellerModalOpen}
                onClose={() => setIsSellerModalOpen(false)}
                onSave={handleSaveSeller}
                sellerToEdit={sellerToEdit}
                themeColor={themeColor}
            />
        </div>
    );
}