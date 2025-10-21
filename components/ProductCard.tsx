import React from 'react';
import type { Product } from '../types';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { StarIcon } from './icons/StarIcon';

interface ProductCardProps {
    product: Product;
}

// FIX: Explicitly type ProductCard as a React.FC to help TypeScript correctly interpret it as a React component.
// This resolves an error where the special 'key' prop was being incorrectly type-checked against the component's props.
export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const whatsappMessage = `Olá, vi o produto "${product.nome}" no Mercado Alagoinhas e tenho interesse!`;
    const whatsappLink = `https://wa.me/55${product.telefone}?text=${encodeURIComponent(whatsappMessage)}`;
    
    return (
        <div className={`bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:scale-105 hover:shadow-2xl ${product.destaque ? 'ring-2 ring-yellow-400 ring-offset-2' : ''}`}>
            <div className="relative">
                <img 
                    src={product.imagem} 
                    alt={product.nome} 
                    className="w-full h-48 object-cover" 
                />
                {product.destaque && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                        <StarIcon />
                        <span>Destaque</span>
                    </div>
                )}
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <p className="text-sm font-semibold text-green-600">{product.categoria}</p>
                <h3 className="text-lg font-bold text-slate-800 mt-1">{product.nome}</h3>
                <p className="text-slate-600 text-sm mt-2 flex-grow">{product.descricao}</p>
                
                {product.tags && product.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {product.tags.map(tag => (
                            <span key={tag} className="text-xs font-semibold bg-slate-200 text-slate-700 px-2 py-1 rounded-full">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                <div className="mt-4">
                    <p className="text-xl font-extrabold text-slate-900">{product.preco}</p>
                    <p className="text-sm text-slate-500 mt-2">
                        Vendido por: <span className="font-semibold">{product.vendedor}</span>
                    </p>
                </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-200">
                <a 
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                >
                    <WhatsAppIcon />
                    Contatar Vendedor
                </a>
            </div>
        </div>
    );
};
