import { type } from "os";

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

export type UserType = 'admin' | 'customer';

export interface User {
    id: string;
    name: string;
    type: UserType;
}

// Seller Management & Subscriptions
export type SellerStatus = 'Pendente' | 'Ativo' | 'Inativo';
export type Plan = 'Básico' | 'Premium';
export type SubscriptionStatus = 'Ativa' | 'Atrasada' | 'Cancelada';

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
    vencimentoAssinatura: string; // ISO String format: YYYY-MM-DD
}
