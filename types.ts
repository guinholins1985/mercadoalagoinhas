export interface User {
    id: string;
    name: string;
    type: 'admin' | 'customer';
}

export interface Product {
    id: string;
    nome: string;
    descricao: string;
    preco: string;
    categoria: string;
    imagem: string;
    vendedor: string;
    telefone: string;
    estoque: number;
    destaque: boolean;
    tags: string[];
}

export type Plan = 'Básico' | 'Premium';
export type SubscriptionStatus = 'Ativa' | 'Atrasada' | 'Cancelada';
export type SellerStatus = 'Pendente' | 'Aprovado' | 'Recusado';

export interface Seller {
    id: string;
    nomeCompleto: string;
    cpfCnpj: string;
    telefone: string;
    email: string;
    enderecoCompleto: string;
    categoriaDeProduto: string;
    status: SellerStatus;
    plan: Plan;
    subscriptionStatus: SubscriptionStatus;
    vencimentoAssinatura: string; // YYYY-MM-DD
}

export interface SellerReview {
    id: string;
    sellerId: string;
    author: string;
    rating: number; // 1 to 5
    comment: string;
    date: string; // YYYY-MM-DD
}
