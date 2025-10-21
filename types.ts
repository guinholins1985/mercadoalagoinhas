
export type User = {
  id: string;
  name: string;
  email: string;
  type: 'admin' | 'customer';
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  sellerId: string;
  sellerName: string;
  rating: number;
  stock: number;
};

export type Seller = {
  id: string;
  nomeCompleto: string;
  nomeNegocio: string;
  email: string;
  telefone: string;
  cnpj: string;
  status: 'Aprovado' | 'Pendente' | 'Rejeitado';
  dataCadastro: string;
  subscriptionStatus: 'Ativa' | 'Inativa';
  rating: number;
};

export type Review = {
  id: string;
  sellerId: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
};

export type Transaction = {
    id: string;
    date: string;
    sellerId: string;
    sellerName: string;
    productId: string;
    productName: string;
    amount: number;
    fee: number;
    netAmount: number;
    status: 'Aprovado' | 'Pendente' | 'Rejeitado';
    paymentMethod: 'Cartão de Crédito' | 'Pix' | 'Boleto';
};
