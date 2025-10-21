import React, { useState, useMemo, useEffect } from 'react';
import type { Product, Seller, Transaction, AppearanceSettings } from '../types';
import { ProductFormModal } from './ProductFormModal';
import { SellerFormModal } from './SellerFormModal';
import { ReportsDashboard } from './ReportsDashboard';
import { FinancialDashboard } from './FinancialDashboard';
import { SettingsDashboard } from './SettingsDashboard';
import { AppearanceDashboard } from './AppearanceDashboard';
import { DataDashboard } from './DataDashboard';
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
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { DatabaseIcon } from './icons/DatabaseIcon';
import { GoogleGenAI } from "@google/genai";
import { TRANSACTIONS } from '../constants';
import { getThemeClasses } from '../utils/theme';


type Tab = 'overview' | 'products' | 'sellers' | 'financial' | 'appearance' | 'data' | 'settings';

interface AdminDashboardProps {
    initialProducts: Product[];
    onProductsChange: (products: Product[]) => void;
    initialSellers: Seller[];
    onSellersChange: (sellers: Seller[]) => void;
    initialAppearance: AppearanceSettings;
    onSaveChanges: (settings: AppearanceSettings) => void;
    onLogout: () => void;
}

export function AdminDashboard({
    initialProducts,
    onProductsChange,
    initialSellers,
    onSellersChange,
    initialAppearance,
    onSaveChanges,
    onLogout
}: AdminDashboardProps) {
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [transactions] = useState<Transaction[]>(TRANSACTIONS);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);
    const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
    const [sellerToEdit, setSellerToEdit] = useState<Seller | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Local state for appearance settings to batch updates
    const [localAppearance, setLocalAppearance] = useState(initialAppearance);
    const theme = getThemeClasses(localAppearance.themeColor);

     // Reset local state if initial props change (e.g., after saving)
    useEffect(() => {
        setLocalAppearance(initialAppearance);
    }, [initialAppearance]);


    const hasChanges = useMemo(() => {
        return JSON.stringify(localAppearance) !== JSON.stringify(initialAppearance);
    }, [localAppearance, initialAppearance]);

    const handleSave = () => {
        setIsSaving(true);
        onSaveChanges(localAppearance);
        setTimeout(() => {
            setIsSaving(false);
        }, 1500); // Simulate save time for user feedback
    };
    
    const handleGoBack = () => {
        if(hasChanges) {
            if(window.confirm('Você tem alterações não salvas. Deseja descartá-las e voltar para a loja?')) {
                onLogout();
            }
        } else {
            onLogout();
        }
    };
    
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
            onProductsChange(initialProducts.filter(p => p.id !== productId));
        }
    };

    const handleSaveProduct = (productData: Omit<Product, 'id' | 'rating'> & { id?: string }) => {
        if (productData.id) {
            onProductsChange(initialProducts.map(p => p.id === productData.id ? { ...p, ...productData } : p));
        } else {
            const newProduct: Product = {
                ...productData,
                id: `prod-${Date.now()}`,
                rating: 0, 
            };
            onProductsChange([newProduct, ...initialProducts]);
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
            onSellersChange(initialSellers.filter(s => s.id !== sellerId));
            onProductsChange(initialProducts.filter(p => p.sellerId !== sellerId));
        }
    };
    
    const handleSaveSeller = (sellerData: Omit<Seller, 'id' | 'dataCadastro' | 'rating'> & { id?: string }) => {
        if (sellerData.id) {
            onSellersChange(initialSellers.map(s => s.id === sellerData.id ? { ...s, ...sellerData } : s));
        } else {
            const newSeller: Seller = {
                ...sellerData,
                id: `seller-${Date.now()}`,
                dataCadastro: new Date().toISOString().split('T')[0],
                rating: 0,
            };
            onSellersChange([newSeller, ...initialSellers]);
        }
    };

    const handleApproveSeller = (sellerId: string) => {
        onSellersChange(initialSellers.map(s => s.id === sellerId ? { ...s, status: 'Aprovado' } : s));
    };
    
    const renderTabContent = () => {
        const { themeColor } = localAppearance;
        switch (activeTab) {
            case 'overview':
                return <ReportsDashboard products={initialProducts} sellers={initialSellers} themeColor={themeColor}/>;
            case 'products':
                return (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-slate-800">Gerenciar Produtos</h2>
                            <button onClick={handleAddProduct} className={`flex items-center gap-2 px-4 py-2 ${theme.bg600} text-white font-semibold rounded-md ${theme.hoverBg700}`}>
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
                                    {initialProducts.map(p => (
                                        <tr key={p.id} className="bg-white border-b hover:bg-slate-50">
                                            <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{p.name}</th>
                                            <td className="px-6 py-4">{p.sellerName}</td>
                                            <td className="px-6 py-4">R$ {p.price.toFixed(2)}</td>
                                            <td className="px-6 py-4">{p.stock}</td>
                                            <td className="px-6 py-4 flex gap-3">
                                                <button onClick={() => handleEditProduct(p)} title="Editar" className="p-1 rounded-full text-blue-600 hover:text-white hover:bg-blue-500 transition-colors"><EditIcon /></button>
                                                <button onClick={() => handleDeleteProduct(p.id)} title="Excluir" className="p-1 rounded-full text-red-600 hover:text-white hover:bg-red-500 transition-colors"><DeleteIcon /></button>
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
                            <button onClick={handleAddSeller} className={`flex items-center gap-2 px-4 py-2 ${theme.bg600} text-white font-semibold rounded-md ${theme.hoverBg700}`}>
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
                                    {initialSellers.map(s => (
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
                                                {s.status === 'Pendente' && <button onClick={() => handleApproveSeller(s.id)} title="Aprovar" className="p-1 rounded-full text-green-600 hover:text-white hover:bg-green-500 transition-colors"><CheckIcon /></button>}
                                                <button onClick={() => handleEditSeller(s)} title="Editar" className="p-1 rounded-full text-blue-600 hover:text-white hover:bg-blue-500 transition-colors"><EditIcon /></button>
                                                <button onClick={() => handleDeleteSeller(s.id)} title="Excluir" className="p-1 rounded-full text-red-600 hover:text-white hover:bg-red-500 transition-colors"><DeleteIcon /></button>
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
                    settings={localAppearance}
                    onSettingsChange={setLocalAppearance}
                />;
            case 'data':
                return <DataDashboard
                    products={initialProducts}
                    sellers={initialSellers}
                    appearance={initialAppearance}
                    onProductsChange={onProductsChange}
                    onSellersChange={onSellersChange}
                    onAppearanceChange={onSaveChanges}
                    themeColor={themeColor}
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
                ? `${theme.bg600} text-white shadow-sm` 
                : 'text-slate-600 hover:bg-slate-200'
            }`}
        >
            {icon} {label}
        </button>
    );

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
                 <h1 className="text-3xl font-bold text-slate-900">Painel do Administrador</h1>
                 <div className="flex items-center gap-3">
                    <button 
                        onClick={handleGoBack}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 font-semibold rounded-md hover:bg-slate-50 transition-colors text-sm"
                    >
                        <ArrowLeftIcon />
                        Voltar para a Loja
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={!hasChanges || isSaving}
                        className={`px-4 py-2 font-semibold rounded-md transition-colors text-sm text-white ${
                            !hasChanges || isSaving
                            ? 'bg-slate-400 cursor-not-allowed'
                            : `${theme.bg600} ${theme.hoverBg700}`
                        }`}
                    >
                       {isSaving ? 'Salvando...' : !hasChanges ? 'Salvo!' : 'Salvar Alterações'}
                    </button>
                 </div>
            </div>
            
            <div className="flex space-x-2 border-b mb-6 overflow-x-auto pb-2 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
                <TabButton tab="overview" label="Visão Geral" icon={<ChartBarIcon className="h-5 w-5"/>} />
                <TabButton tab="products" label="Produtos" icon={<PackageIcon className="h-5 w-5"/>} />
                <TabButton tab="sellers" label="Vendedores" icon={<UsersIcon className="h-5 w-5"/>} />
                <TabButton tab="financial" label="Financeiro" icon={<CreditCardIcon className="h-5 w-5"/>} />
                <TabButton tab="appearance" label="Aparência" icon={<EyeIcon className="h-5 w-5"/>} />
                <TabButton tab="data" label="Dados" icon={<DatabaseIcon className="h-5 w-5"/>} />
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
                sellers={initialSellers}
                onGenerateDescription={handleGenerateDescription}
                isGenerating={isGenerating}
                themeColor={localAppearance.themeColor}
            />

             <SellerFormModal
                isOpen={isSellerModalOpen}
                onClose={() => setIsSellerModalOpen(false)}
                onSave={handleSaveSeller}
                sellerToEdit={sellerToEdit}
                themeColor={localAppearance.themeColor}
            />
        </div>
    );
}
