import React from 'react';
import type { Product } from '../types';
import { StarRating } from './StarRating';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { SellerReviewsModal } from './SellerReviewsModal';
import { SELLERS } from '../constants';

// FIX: Changed component to be of type React.FC to correctly handle React's 'key' prop,
// resolving a TypeScript error in ProductList.tsx.
interface ProductCardProps {
    product: Product;
    themeColor: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, themeColor }) => {
    const [isReviewsModalOpen, setIsReviewsModalOpen] = React.useState(false);
    const seller = SELLERS.find(s => s.id === product.sellerId);

    const handleSellerClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (seller) {
            setIsReviewsModalOpen(true);
        }
    };

    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(product.price);

    const whatsappLink = seller 
        ? `https://wa.me/55${seller.telefone}?text=${encodeURIComponent(`Olá, ${seller.nomeNegocio}! Tenho interesse no produto "${product.name}".`)}`
        : '#';

    return (
        <>
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl flex flex-col">
                <div className="relative">
                    <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-sm font-semibold text-slate-700 shadow">
                        {product.category}
                    </div>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-slate-800 truncate">{product.name}</h3>
                    <button
                        onClick={handleSellerClick}
                        className={`text-sm text-${themeColor}-600 hover:underline mt-1 text-left`}
                        aria-label={`Ver avaliações de ${product.sellerName}`}
                    >
                        Vendido por: <span className="font-semibold">{product.sellerName}</span>
                    </button>
                    
                    <div className="mt-2 flex items-center" title={`${product.rating.toFixed(1)} de 5 estrelas`}>
                        <StarRating rating={product.rating} />
                        <span className="text-xs text-slate-500 ml-2">({product.rating.toFixed(1)})</span>
                    </div>

                    <p className="text-sm text-slate-600 mt-2 flex-grow">{product.description}</p>
                    
                    <div className="mt-4 flex justify-between items-center">
                        <p className={`text-2xl font-extrabold text-${themeColor}-700`}>{formattedPrice}</p>
                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2 px-4 py-2 bg-${themeColor}-500 text-white font-semibold rounded-full hover:bg-${themeColor}-600 transition-colors text-sm shadow`}
                            aria-label={`Contatar ${product.sellerName} via WhatsApp`}
                        >
                            <WhatsAppIcon />
                            Contatar
                        </a>
                    </div>
                </div>
            </div>
            {seller && (
                <SellerReviewsModal 
                    isOpen={isReviewsModalOpen}
                    onClose={() => setIsReviewsModalOpen(false)}
                    seller={seller}
                    themeColor={themeColor}
                />
            )}
        </>
    );
};