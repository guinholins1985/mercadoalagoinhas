import React, { useState, useMemo } from 'react';
import type { Product, Seller } from '../types';
import { EditIcon } from './icons/EditIcon';
import { DeleteIcon } from './icons/DeleteIcon';
import { PlusIcon } from './icons/PlusIcon';
import { ProductFormModal } from './ProductFormModal';
import { SellerFormModal } from './SellerFormModal';
import { PackageIcon } from './icons/PackageIcon';
import { UsersIcon } from './icons/UsersIcon';
import { ClockIcon } from './icons/ClockIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { CheckIcon } from './icons/CheckIcon';
import { BlockIcon } from './icons/BlockIcon';
import { CreditCardIcon } from './icons/CreditCardIcon';
import { PLAN_DETAILS } from '../constants';

interface AdminDashboardProps {
    products: Product[];
    sellers: Seller[];
    onAddProduct: (productData: Omit<Product, 'id'>) => void;
    onUpdateProduct: (productData: Product) => void;
    onDeleteProduct: (productId: string) => void;
    onAddSeller: (sellerData: Omit<Seller, 'id'>) => void;
    onUpdateSeller: (sellerData: Seller) => void;
    onDeleteSeller: (sellerId: string) => void;
}

type AdminTab = 'overview' | 'products' | 'sellers';
type SellerStatusFilter = 'All' | 'Ativo' | 'Inativo' | 'Pendente';

export function AdminDashboard({ 
    products, sellers, 
    onAddProduct, onUpdateProduct, onDeleteProduct,
    onAddSeller, onUpdateSeller, onDeleteSeller 
}: AdminDashboardProps) {
    
    // Modals State
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
    const [editingSeller, setEditingSeller] = useState<Seller | null>(null);
    
    // UI State
    const [activeTab, setActiveTab] = useState<AdminTab>('overview');

    // Filter States
    const [productSearchTerm, setProductSearchTerm] = useState('');
    const [productCategoryFilter, setProductCategoryFilter] = useState('All');
    const [sellerStatusFilter, setSellerStatusFilter] = useState<SellerStatusFilter>('All');

    // Memoized Calculations & Filters
    const productCategories = useMemo(() => ['All', ...Array.from(new Set(products.map(p => p.categoria)))], [products]);
    const activeSellers = useMemo(() => sellers.filter(s => s.status === 'Ativo').length, [sellers]);
    const pendingSellers = useMemo(() => sellers.filter(s => s.status === 'Pendente').length, [sellers]);
    const overdueSubscriptions = useMemo(() => sellers.filter(s => s.subscriptionStatus === 'Atrasada').length, [sellers]);

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const searchMatch = p.nome.toLowerCase().includes(productSearchTerm.toLowerCase());
            const categoryMatch = productCategoryFilter === 'All' || p.categoria === productCategoryFilter;
            return searchMatch && categoryMatch;
        });
    }, [products, productSearchTerm, productCategoryFilter]);
    
    const filteredSellers = useMemo(() => {
         if (sellerStatusFilter === 'All') return sellers;
         return sellers.filter(s => s.status === sellerStatusFilter);
    }, [sellers, sellerStatusFilter]);


    // Product Modal Handlers
    const handleOpenProductModalForCreate = () => { setEditingProduct(null); setIsProductModalOpen(true); };
    const handleOpenProductModalForEdit = (product: Product) => { setEditingProduct(product); setIsProductModalOpen(true); };
    const handleCloseProductModal = () => { setIsProductModalOpen(false); setEditingProduct(null); };
    const handleProductSubmit = (productData: Product | Omit<Product, 'id'>) => {
        if ('id' in productData) onUpdateProduct(productData as Product);
        else onAddProduct(productData as Omit<Product, 'id'>);
        handleCloseProductModal();
    };

    // Seller Modal Handlers
    const handleOpenSellerModalForCreate = () => { setEditingSeller(null); setIsSellerModalOpen(true); };
    const handleOpenSellerModalForEdit = (seller: Seller) => { setEditingSeller(seller); setIsSellerModalOpen(true); };
    const handleCloseSellerModal = () => { setIsSellerModalOpen(false); setEditingSeller(null); };
    const handleSellerSubmit = (sellerData: Seller | Omit<Seller, 'id'>) => {
        if ('id' in sellerData) onUpdateSeller(sellerData as Seller);
        else onAddSeller(sellerData as Omit<Seller, 'id'>);
        handleCloseSellerModal();
    };

    // Seller Action Handlers
    const handleToggleSellerStatus = (seller: Seller, newStatus: 'Ativo' | 'Inativo') => {
        if (window.confirm(`Tem certeza que deseja alterar o status de "${seller.nomeCompleto}" para ${newStatus}?`)) {
            onUpdateSeller({ ...seller, status: newStatus });
        }
    };
    const handleApproveSeller = (seller: Seller) => {
        if (window.confirm(`Aprovar o cadastro de "${seller.nomeCompleto}"?`)) {
            onUpdateSeller({ ...seller, status: 'Ativo' });
        }
    };

    // CSV Export
    const exportToCsv = (filename: string, data: any[]) => {
        if (data.length === 0) {
            alert("Nenhum dado para exportar.");
            return;
        }
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => JSON.stringify(row[header])).join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `${filename}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const TabButton: React.FC<{tabId: AdminTab, children: React.ReactNode}> = ({ tabId, children }) => (
        <button
            onClick={() => setActiveTab(tabId)}
            className={`px-4 py-2 font-semibold rounded-t-lg transition-colors focus:outline-none ${
                activeTab === tabId 
                ? 'bg-white text-green-600' 
                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            }`}
        >
            {children}
        </button>
    );

    const subscriptionStatusClasses: {[key in Seller['subscriptionStatus']]: string} = {
        'Ativa': 'bg-green-100 text-green-800',
        'Atrasada': 'bg-red-100 text-red-800',
        'Cancelada': 'bg-slate-200 text-slate-700',
    };

    const sellerStatusClasses: {[key in Seller['status']]: string} = {
        'Ativo': 'bg-green-100 text-green-800',
        'Inativo': 'bg-red-100 text-red-800',
        'Pendente': 'bg-yellow-100 text-yellow-800',
    };
    
    return (
        <div className="bg-slate-100 p-4 sm:p-6 lg:p-8 rounded-lg -m-4 sm:-m-6 lg:-m-8">
            <ProductFormModal isOpen={isProductModalOpen} onClose={handleCloseProductModal} onSubmit={handleProductSubmit} product={editingProduct} />
            <SellerFormModal isOpen={isSellerModalOpen} onClose={handleCloseSellerModal} onSubmit={handleSellerSubmit} seller={editingSeller} products={products} />

            <h2 className="text-2xl font-bold text-slate-800 mb-6">Painel do Administrador</h2>
            
            <div className="flex border-b border-slate-300">
                <TabButton tabId="overview">Visão Geral</TabButton>
                <TabButton tabId="products">Gerenciar Produtos</TabButton>
                <TabButton tabId="sellers">Gerenciar Vendedores</TabButton>
            </div>

            <div className="bg-white p-6 rounded-b-lg shadow-md">
                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-slate-50 p-5 rounded-lg shadow-sm border border-slate-200">
                            <PackageIcon className="h-8 w-8 text-green-500 mb-2"/>
                            <p className="text-3xl font-bold text-slate-800">{products.length}</p>
                            <p className="text-slate-500">Produtos Cadastrados</p>
                        </div>
                        <div className="bg-slate-50 p-5 rounded-lg shadow-sm border border-slate-200">
                            <UsersIcon className="h-8 w-8 text-blue-500 mb-2"/>
                            <p className="text-3xl font-bold text-slate-800">{activeSellers}</p>
                            <p className="text-slate-500">Vendedores Ativos</p>
                        </div>
                        <div className="bg-slate-50 p-5 rounded-lg shadow-sm border border-slate-200">
                            <ClockIcon className="h-8 w-8 text-yellow-500 mb-2"/>
                            <p className="text-3xl font-bold text-slate-800">{pendingSellers}</p>
                            <p className="text-slate-500">Cadastros Pendentes</p>
                        </div>
                         <div className="bg-slate-50 p-5 rounded-lg shadow-sm border border-slate-200">
                            <CreditCardIcon className="h-8 w-8 text-red-500 mb-2"/>
                            <p className="text-3xl font-bold text-slate-800">{overdueSubscriptions}</p>
                            <p className="text-slate-500">Assinaturas Atrasadas</p>
                        </div>
                    </div>
                )}

                {/* PRODUCTS TAB */}
                {activeTab === 'products' && (
                    <div>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                            <div className="flex gap-4 w-full sm:w-auto">
                                <input type="text" placeholder="Buscar produto..." value={productSearchTerm} onChange={e => setProductSearchTerm(e.target.value)} className="w-full sm:w-64 border border-slate-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500" />
                                <select value={productCategoryFilter} onChange={e => setProductCategoryFilter(e.target.value)} className="border border-slate-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500">
                                    {productCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => exportToCsv('produtos', filteredProducts)} className="flex items-center gap-2 font-semibold py-2 px-4 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300"><DownloadIcon /> Exportar CSV</button>
                                <button onClick={handleOpenProductModalForCreate} className="flex items-center gap-2 font-bold py-2 px-4 rounded-lg bg-green-600 text-white hover:bg-green-700"><PlusIcon /> Adicionar</button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-slate-500">
                                <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Produto</th><th scope="col" className="px-6 py-3">Categoria</th><th scope="col" className="px-6 py-3">Preço</th><th scope="col" className="px-6 py-3">Estoque</th><th scope="col" className="px-6 py-3">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map(product => (
                                        <tr key={product.id} className="bg-white border-b hover:bg-slate-50">
                                            <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{product.nome}</th>
                                            <td className="px-6 py-4">{product.categoria}</td>
                                            <td className="px-6 py-4">{product.preco}</td>
                                            <td className={`px-6 py-4 font-bold ${product.estoque === 0 ? 'text-red-600' : product.estoque <= 5 ? 'text-yellow-600' : ''}`}>{product.estoque}</td>
                                            <td className="px-6 py-4 flex items-center gap-4">
                                                <button onClick={() => handleOpenProductModalForEdit(product)} className="text-blue-600 hover:text-blue-800"><EditIcon /></button>
                                                <button onClick={() => { if(window.confirm(`Tem certeza?`)) onDeleteProduct(product.id) }} className="text-red-600 hover:text-red-800"><DeleteIcon /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredProducts.length === 0 && <div className="text-center py-8 text-slate-500">Nenhum produto encontrado.</div>}
                        </div>
                    </div>
                )}
                
                {/* SELLERS TAB */}
                {activeTab === 'sellers' && (
                    <div>
                         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                             <div>
                                {(['All', 'Ativo', 'Inativo', 'Pendente'] as SellerStatusFilter[]).map(status => (
                                    <button key={status} onClick={() => setSellerStatusFilter(status)} className={`px-3 py-1 mr-2 rounded-full text-sm font-semibold transition-colors ${sellerStatusFilter === status ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}>{status}</button>
                                ))}
                             </div>
                            <div className="flex gap-2">
                                <button onClick={() => exportToCsv('vendedores', filteredSellers)} className="flex items-center gap-2 font-semibold py-2 px-4 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300"><DownloadIcon /> Exportar CSV</button>
                                <button onClick={handleOpenSellerModalForCreate} className="flex items-center gap-2 font-bold py-2 px-4 rounded-lg bg-green-600 text-white hover:bg-green-700"><PlusIcon /> Adicionar</button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-slate-500">
                                <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                                    <tr>
                                        <th className="px-6 py-3">Vendedor</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Plano</th><th className="px-6 py-3">Status Assinatura</th><th className="px-6 py-3">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSellers.map(seller => {
                                        const sellerProductCount = products.filter(p => p.vendedor === seller.nomeCompleto).length;
                                        const exceedsLimit = seller.plan === 'Básico' && sellerProductCount > PLAN_DETAILS['Básico'].productLimit;
                                        return (
                                            <tr key={seller.id} className="bg-white border-b hover:bg-slate-50">
                                                <td className="px-6 py-4 font-medium text-slate-900">
                                                    {seller.nomeCompleto}
                                                    {exceedsLimit && <p className="text-xs text-red-600 font-bold">Limite de produtos excedido ({sellerProductCount}/{PLAN_DETAILS['Básico'].productLimit})</p>}
                                                </td>
                                                <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-medium rounded-full ${sellerStatusClasses[seller.status]}`}>{seller.status}</span></td>
                                                <td className="px-6 py-4">{seller.plan}</td>
                                                <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-medium rounded-full ${subscriptionStatusClasses[seller.subscriptionStatus]}`}>{seller.subscriptionStatus}</span></td>
                                                <td className="px-6 py-4 flex items-center gap-3">
                                                    <button onClick={() => handleOpenSellerModalForEdit(seller)} className="text-blue-600 hover:text-blue-800" title="Detalhes/Editar"><EditIcon /></button>
                                                    {seller.status === 'Pendente' && <button onClick={() => handleApproveSeller(seller)} className="text-green-600 hover:text-green-800" title="Aprovar"><CheckIcon /></button>}
                                                    {seller.status === 'Ativo' && <button onClick={() => handleToggleSellerStatus(seller, 'Inativo')} className="text-yellow-600 hover:text-yellow-800" title="Bloquear"><BlockIcon /></button>}
                                                    {seller.status === 'Inativo' && <button onClick={() => handleToggleSellerStatus(seller, 'Ativo')} className="text-green-600 hover:text-green-800" title="Reativar"><CheckIcon /></button>}
                                                    <button onClick={() => { if(window.confirm(`Tem certeza?`)) onDeleteSeller(seller.id) }} className="text-red-600 hover:text-red-800" title="Excluir"><DeleteIcon /></button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                             {filteredSellers.length === 0 && <div className="text-center py-8 text-slate-500">Nenhum vendedor encontrado.</div>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
