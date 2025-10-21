import React, { useState } from 'react';
import type { Product, Seller } from '../types';
import { ProductFormModal } from './ProductFormModal';
import { SellerFormModal } from './SellerFormModal';
import { SellerReviewsModal } from './SellerReviewsModal';
import { PlusIcon } from './icons/PlusIcon';
import { EditIcon } from './icons/EditIcon';
import { DeleteIcon } from './icons/DeleteIcon';
import { PackageIcon } from './icons/PackageIcon';
import { UsersIcon } from './icons/UsersIcon';
import { StarIcon } from './icons/StarIcon';

interface AdminDashboardProps {
    products: Product[];
    sellers: Seller[];
    onAddProduct: (productData: Omit<Product, 'id'>) => void;
    onUpdateProduct: (product: Product) => void;
    onDeleteProduct: (productId: string) => void;
    onAddSeller: (sellerData: Omit<Seller, 'id'>) => void;
    onUpdateSeller: (seller: Seller) => void;
    onDeleteSeller: (sellerId: string) => void;
}

type ActiveTab = 'products' | 'sellers';

export function AdminDashboard({
    products,
    sellers,
    onAddProduct,
    onUpdateProduct,
    onDeleteProduct,
    onAddSeller,
    onUpdateSeller,
    onDeleteSeller,
}: AdminDashboardProps) {
    const [activeTab, setActiveTab] = useState<ActiveTab>('products');
    
    // Modal states
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
    const [editingSeller, setEditingSeller] = useState<Seller | null>(null);

    const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
    const [reviewingSeller, setReviewingSeller] = useState<Seller | null>(null);


    // Product handlers
    const handleOpenProductModal = (product: Product | null = null) => {
        setEditingProduct(product);
        setIsProductModalOpen(true);
    };

    const handleCloseProductModal = () => {
        setIsProductModalOpen(false);
        setEditingProduct(null);
    };

    const handleProductSubmit = (productData: Product | Omit<Product, 'id'>) => {
        if ('id' in productData) {
            onUpdateProduct(productData);
        } else {
            onAddProduct(productData);
        }
        handleCloseProductModal();
    };

    const confirmDeleteProduct = (productId: string) => {
        if (window.confirm('Tem certeza que deseja excluir este produto?')) {
            onDeleteProduct(productId);
        }
    };

    // Seller handlers
    const handleOpenSellerModal = (seller: Seller | null = null) => {
        setEditingSeller(seller);
        setIsSellerModalOpen(true);
    };
    
    const handleCloseSellerModal = () => {
        setIsSellerModalOpen(false);
        setEditingSeller(null);
    };

    const handleSellerSubmit = (sellerData: Seller | Omit<Seller, 'id'>) => {
        if ('id' in sellerData) {
            onUpdateSeller(sellerData);
        } else {
            onAddSeller(sellerData);
        }
        handleCloseSellerModal();
    };

    const confirmDeleteSeller = (sellerId: string) => {
        if (window.confirm('Tem certeza que deseja excluir este vendedor? Esta ação não pode ser desfeita.')) {
            onDeleteSeller(sellerId);
        }
    };
    
    // Reviews handlers
    const handleOpenReviewsModal = (seller: Seller) => {
        setReviewingSeller(seller);
        setIsReviewsModalOpen(true);
    };

    const handleCloseReviewsModal = () => {
        setIsReviewsModalOpen(false);
        setReviewingSeller(null);
    };

    const TabButton: React.FC<{tabId: ActiveTab, currentTab: ActiveTab, children: React.ReactNode, icon: React.ReactNode}> = ({ tabId, currentTab, children, icon }) => (
         <button
            onClick={() => setActiveTab(tabId)}
            className={`flex items-center justify-center gap-2 w-1/2 py-3 font-semibold text-center focus:outline-none transition-all duration-200 border-b-2 ${
                currentTab === tabId 
                ? 'text-green-600 border-green-600' 
                : 'text-slate-500 hover:text-slate-700 border-transparent hover:border-slate-300'
            }`}
        >
            {icon}
            {children}
        </button>
    );

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Painel do Administrador</h2>

            <div className="flex border-b mb-6">
                <TabButton tabId="products" currentTab={activeTab} icon={<PackageIcon />}>
                    Gerenciar Produtos ({products.length})
                </TabButton>
                <TabButton tabId="sellers" currentTab={activeTab} icon={<UsersIcon />}>
                    Gerenciar Vendedores ({sellers.length})
                </TabButton>
            </div>

            {activeTab === 'products' && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-slate-700">Lista de Produtos</h3>
                        <button onClick={() => handleOpenProductModal(null)} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors">
                            <PlusIcon />
                            Adicionar Produto
                        </button>
                    </div>
                    {/* Product Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-500">
                             <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Produto</th>
                                    <th scope="col" className="px-6 py-3">Vendedor</th>
                                    <th scope="col" className="px-6 py-3">Preço</th>
                                    <th scope="col" className="px-6 py-3">Estoque</th>
                                    <th scope="col" className="px-6 py-3 text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p.id} className="bg-white border-b hover:bg-slate-50">
                                        <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{p.nome}</th>
                                        <td className="px-6 py-4">{p.vendedor}</td>
                                        <td className="px-6 py-4">{p.preco}</td>
                                        <td className="px-6 py-4">{p.estoque}</td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => handleOpenProductModal(p)} className="p-2 text-blue-600 hover:text-blue-800" aria-label="Editar"><EditIcon /></button>
                                                <button onClick={() => confirmDeleteProduct(p.id)} className="p-2 text-red-600 hover:text-red-800" aria-label="Excluir"><DeleteIcon /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'sellers' && (
                <div>
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-slate-700">Lista de Vendedores</h3>
                        <button onClick={() => handleOpenSellerModal(null)} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors">
                            <PlusIcon />
                            Adicionar Vendedor
                        </button>
                    </div>
                    {/* Seller Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-500">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Nome</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    <th scope="col" className="px-6 py-3">Plano</th>
                                    <th scope="col" className="px-6 py-3">E-mail</th>
                                    <th scope="col" className="px-6 py-3 text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sellers.map(s => (
                                    <tr key={s.id} className="bg-white border-b hover:bg-slate-50">
                                        <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{s.nomeCompleto}</th>
                                        <td className="px-6 py-4">{s.status}</td>
                                        <td className="px-6 py-4">{s.plan}</td>
                                        <td className="px-6 py-4">{s.email}</td>
                                        <td className="px-6 py-4 text-center">
                                             <div className="flex justify-center gap-2">
                                                <button onClick={() => handleOpenReviewsModal(s)} className="p-2 text-yellow-500 hover:text-yellow-700" aria-label="Ver avaliações"><StarIcon/></button>
                                                <button onClick={() => handleOpenSellerModal(s)} className="p-2 text-blue-600 hover:text-blue-800" aria-label="Editar"><EditIcon /></button>
                                                <button onClick={() => confirmDeleteSeller(s.id)} className="p-2 text-red-600 hover:text-red-800" aria-label="Excluir"><DeleteIcon /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
            <ProductFormModal 
                isOpen={isProductModalOpen}
                onClose={handleCloseProductModal}
                onSubmit={handleProductSubmit}
                product={editingProduct}
            />

             <SellerFormModal
                isOpen={isSellerModalOpen}
                onClose={handleCloseSellerModal}
                onSubmit={handleSellerSubmit}
                seller={editingSeller}
                products={products}
            />

            <SellerReviewsModal
                isOpen={isReviewsModalOpen}
                onClose={handleCloseReviewsModal}
                seller={reviewingSeller}
            />

        </div>
    );
}
