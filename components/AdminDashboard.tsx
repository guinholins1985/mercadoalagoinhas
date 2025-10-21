import React, { useState } from 'react';
import type { User, Product } from '../types';
import { ProductFormModal } from './ProductFormModal';
import { PlusIcon } from './icons/PlusIcon';
import { EditIcon } from './icons/EditIcon';
import { DeleteIcon } from './icons/DeleteIcon';


interface AdminDashboardProps {
    user: User;
    onLogout: () => void;
    products: Product[];
    onAddProduct: (product: Omit<Product, 'id'>) => void;
    onUpdateProduct: (product: Product) => void;
    onDeleteProduct: (productId: number) => void;
}

export function AdminDashboard({ user, onLogout, products, onAddProduct, onUpdateProduct, onDeleteProduct }: AdminDashboardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const handleOpenAddModal = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleDelete = (productId: number) => {
        if (window.confirm('Tem certeza que deseja excluir este produto? A ação não poderá ser desfeita.')) {
            onDeleteProduct(productId);
        }
    };
    
    const handleSubmit = (productData: Product | Omit<Product, 'id'>) => {
        if ('id' in productData) {
            onUpdateProduct(productData as Product);
        } else {
            onAddProduct(productData as Omit<Product, 'id'>);
        }
        handleCloseModal();
    }

    return (
        <div className="min-h-screen bg-slate-200 text-slate-800">
            <header className="bg-white shadow-md p-4">
                <div className="container mx-auto flex justify-between items-center max-w-7xl">
                    <h1 className="text-2xl font-bold text-indigo-600">
                        Painel do Administrador
                    </h1>
                    <div>
                        <span className="text-slate-700 mr-4">
                            Logado como: <span className="font-bold">{user.name}</span>
                        </span>
                        <button
                            onClick={onLogout}
                            className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors"
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold">Gerenciar Produtos</h2>
                    <button 
                        onClick={handleOpenAddModal}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors shadow-sm"
                    >
                       <PlusIcon />
                       Adicionar Produto
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-xl overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-100 border-b border-slate-300">
                            <tr>
                                <th className="p-4 font-semibold">Produto</th>
                                <th className="p-4 font-semibold hidden md:table-cell">Categoria</th>
                                <th className="p-4 font-semibold hidden sm:table-cell">Preço</th>
                                <th className="p-4 font-semibold hidden lg:table-cell">Vendedor</th>
                                <th className="p-4 font-semibold">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(produto => (
                                <tr key={produto.id} className="border-b border-slate-200 hover:bg-slate-50">
                                    <td className="p-4 flex items-center">
                                        <img src={produto.imagem} alt={produto.nome} className="w-12 h-12 object-cover rounded-md mr-4 hidden sm:block" />
                                        <span className="font-medium">{produto.nome}</span>
                                    </td>
                                    <td className="p-4 hidden md:table-cell">{produto.categoria}</td>
                                    <td className="p-4 hidden sm:table-cell">{produto.preco}</td>
                                    <td className="p-4 hidden lg:table-cell">{produto.vendedor}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => handleOpenEditModal(produto)} 
                                                className="p-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-colors"
                                                aria-label={`Editar ${produto.nome}`}
                                            >
                                                <EditIcon />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(produto.id)} 
                                                className="p-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-colors"
                                                aria-label={`Excluir ${produto.nome}`}
                                            >
                                                <DeleteIcon />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            <ProductFormModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                product={editingProduct}
            />
        </div>
    );
}
