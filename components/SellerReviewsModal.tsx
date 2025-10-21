import React from 'react';
// FIX: Corrected import paths for types and constants
import type { Seller } from '../types';
import { SELLER_REVIEWS } from '../constants'; // Mock data for reviews
import { StarRating } from './StarRating';
import { getThemeClasses } from '../utils/theme';

interface SellerReviewsModalProps {
    isOpen: boolean;
    onClose: () => void;
    seller: Seller | null;
    themeColor: string;
}

export const SellerReviewsModal: React.FC<SellerReviewsModalProps> = ({ isOpen, onClose, seller, themeColor }) => {
    if (!isOpen || !seller) return null;

    const theme = getThemeClasses(themeColor);
    const reviews = SELLER_REVIEWS.filter(review => review.sellerId === seller.id);
    const averageRating = reviews.length > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        : 0;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start p-4 pt-16 sm:items-center" 
            aria-modal="true" 
            role="dialog"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">Avaliações de</h2>
                            <h3 className={`text-xl font-semibold ${theme.text600}`}>{seller.nomeNegocio}</h3>
                        </div>
                        <button onClick={onClose} className="text-2xl text-slate-500 hover:text-slate-800">&times;</button>
                    </div>

                    <div className="my-6 p-4 bg-slate-50 rounded-lg flex items-center justify-center gap-4">
                        <span className="text-4xl font-bold text-slate-700">{averageRating.toFixed(1)}</span>
                        <div>
                            <StarRating rating={averageRating} />
                            <p className="text-sm text-slate-500 mt-1">Média de {reviews.length} avaliações</p>
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                        {reviews.length > 0 ? (
                            reviews.map(review => (
                                <div key={review.id} className="border-b pb-4 last:border-b-0">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-slate-700">{review.author}</span>
                                        <StarRating rating={review.rating} sizeClass="h-4 w-4" />
                                    </div>
                                    <p className="text-sm text-slate-500 mt-1">{new Date(review.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric'})}</p>
                                    <p className="mt-2 text-slate-600">{review.comment}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-slate-500 py-8">Este vendedor ainda não possui avaliações.</p>
                        )}
                    </div>
                     <div className="flex justify-end pt-6 mt-6 border-t">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-700 font-semibold rounded-md hover:bg-slate-300">
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
