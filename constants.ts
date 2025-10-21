import type { Product, User, Seller, Review } from './types';

// Mock Users
export const USERS: User[] = [
  { id: 'user-1', name: 'Ana Silva', email: 'ana@example.com', type: 'customer' },
  { id: 'user-2', name: 'Admin', email: 'ad', type: 'admin' },
];

// Mock Sellers
export const SELLERS: Seller[] = [
  {
    id: 'seller-1',
    nomeCompleto: 'João Pereira da Silva',
    nomeNegocio: 'Sítio do João',
    email: 'joao.sitio@email.com',
    telefone: '75999998888',
    status: 'Aprovado',
    dataCadastro: '2023-01-15',
    subscriptionStatus: 'Ativa',
    rating: 4.8,
  },
  {
    id: 'seller-2',
    nomeCompleto: 'Maria Oliveira Souza',
    nomeNegocio: 'Delícias da Maria',
    email: 'maria.delicias@email.com',
    telefone: '75988887777',
    status: 'Aprovado',
    dataCadastro: '2023-02-20',
    subscriptionStatus: 'Ativa',
    rating: 4.5,
  },
  {
    id: 'seller-3',
    nomeCompleto: 'Carlos Andrade',
    nomeNegocio: 'Artesanato Mãos de Ouro',
    email: 'carlos.artes@email.com',
    telefone: '75977776666',
    status: 'Pendente',
    dataCadastro: '2023-03-10',
    subscriptionStatus: 'Inativa',
    rating: 0,
  },
];

// Mock Products
export const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Cesta de Orgânicos',
    description: 'Uma seleção de frutas e vegetais frescos e orgânicos, colhidos na hora.',
    price: 85.00,
    category: 'Cestas',
    imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
    sellerId: 'seller-1',
    sellerName: 'Sítio do João',
    rating: 4.8,
  },
  {
    id: 'prod-2',
    name: 'Bolo de Chocolate Caseiro',
    description: 'Bolo fofinho de chocolate com cobertura cremosa, feito com ingredientes de primeira.',
    price: 45.00,
    category: 'Doces',
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
    sellerId: 'seller-2',
    sellerName: 'Delícias da Maria',
    rating: 4.9,
  },
  {
    id: 'prod-3',
    name: 'Abacaxi Pérola (Unidade)',
    description: 'Abacaxi doce e suculento, cultivado sem agrotóxicos.',
    price: 8.00,
    category: 'Frutas',
    imageUrl: 'https://images.unsplash.com/photo-1587883130588-fe059b588265?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
    sellerId: 'seller-1',
    sellerName: 'Sítio do João',
    rating: 4.7,
  },
   {
    id: 'prod-4',
    name: 'Pão de Queijo Congelado (500g)',
    description: 'Pão de queijo tradicional mineiro, pronto para assar.',
    price: 25.00,
    category: 'Salgados',
    imageUrl: 'https://images.unsplash.com/photo-1593328223414-11810a9b4f49?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
    sellerId: 'seller-2',
    sellerName: 'Delícias da Maria',
    rating: 4.6,
  },
  {
    id: 'prod-5',
    name: 'Vaso de Cerâmica Artesanal',
    description: 'Vaso decorativo feito à mão por artesãos locais. Perfeito para plantas pequenas.',
    price: 60.00,
    category: 'Artesanato',
    imageUrl: 'https://images.unsplash.com/photo-1570913193206-935a84277717?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
    sellerId: 'seller-3',
    sellerName: 'Artesanato Mãos de Ouro',
    rating: 5.0,
  }
];

// Mock Reviews for SellerReviewsModal
export const SELLER_REVIEWS: Review[] = [
    {
        id: 'review-1',
        sellerId: 'seller-1',
        author: 'Mariana Costa',
        rating: 5,
        date: '2023-08-10',
        comment: 'Produtos sempre frescos e de ótima qualidade! A cesta de orgânicos é maravilhosa.'
    },
    {
        id: 'review-2',
        sellerId: 'seller-1',
        author: 'Pedro Almeida',
        rating: 4,
        date: '2023-08-05',
        comment: 'Gostei muito dos produtos, só a entrega que demorou um pouco mais que o esperado.'
    },
    {
        id: 'review-3',
        sellerId: 'seller-2',
        author: 'Carla Dias',
        rating: 5,
        date: '2023-08-12',
        comment: 'O bolo de chocolate é simplesmente divino! Recomendo a todos.'
    },
    {
        id: 'review-4',
        sellerId: 'seller-2',
        author: 'Fernanda Lima',
        rating: 5,
        date: '2023-07-28',
        comment: 'Tudo que eu compro da Maria é delicioso. O pão de queijo é um espetáculo.'
    }
];