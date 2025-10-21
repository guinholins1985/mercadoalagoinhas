
import React from 'react';
import { ProductCard } from './ProductCard';
import type { Product } from '../types';

interface ProductListProps {
    products: Product[];
    searchTerm: string;
}

export function ProductList({ products, searchTerm }: ProductListProps) {
    if (products.length === 0 && searchTerm.trim() !== '') {
        return (
            <div className="text-center py-16 px-4 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-slate-700">Nenhum produto encontrado</h2>
                <p className="mt-2 text-slate-500">
                    Tente buscar por outro termo, como "bolo" ou "artesanato".
                </p>
            </div>
        );
    }
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {products.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}
