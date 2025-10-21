import type { User, Product, Seller, SellerReview } from './types';

export const USERS: User[] = [
    { id: 'u1', name: 'Ana Silva (Cliente)', type: 'customer' },
    { id: 'u2', name: 'Carlos Souza (Cliente)', type: 'customer' },
    { id: 'admin-user', name: 'Administrador', type: 'admin' },
];

export const SELLERS: Seller[] = [
    {
        id: 's1',
        nomeCompleto: 'Fazenda Orgânica Sol Nascente',
        email: 'contato@solnascente.com',
        telefone: '71988776655',
        cpfCnpj: '12.345.678/0001-99',
        enderecoCompleto: 'Rua das Flores, 123, Alagoinhas, BA',
        categoriaDeProduto: 'Orgânicos e Hortifruti',
        status: 'Aprovado',
        plan: 'Premium',
        subscriptionStatus: 'Ativa',
        vencimentoAssinatura: '2024-12-31',
    },
    {
        id: 's2',
        nomeCompleto: 'Bolos da Vovó Juju',
        email: 'juju@bolos.com',
        telefone: '71999887766',
        cpfCnpj: '98.765.432/0001-11',
        enderecoCompleto: 'Avenida Principal, 456, Alagoinhas, BA',
        categoriaDeProduto: 'Confeitaria',
        status: 'Aprovado',
        plan: 'Básico',
        subscriptionStatus: 'Ativa',
        vencimentoAssinatura: '2024-11-15',
    },
    {
        id: 's3',
        nomeCompleto: 'Artesanato Mãos de Fada',
        email: 'contato@maosdefada.com',
        telefone: '71987654321',
        cpfCnpj: '123.456.789-00',
        enderecoCompleto: 'Praça da Matriz, 789, Alagoinhas, BA',
        categoriaDeProduto: 'Artesanato',
        status: 'Pendente',
        plan: 'Básico',
        subscriptionStatus: 'Ativa',
        vencimentoAssinatura: '2024-10-20',
    },
];

export const PRODUCTS: Product[] = [
    {
        id: 'p1',
        nome: 'Cesta de Orgânicos Pequena',
        descricao: 'Uma seleção de vegetais e frutas frescas da estação, colhidas no dia. Ideal para uma pessoa ou casal.',
        preco: 'R$ 45,00',
        categoria: 'Cestas',
        imagem: 'https://picsum.photos/seed/p1/400/300',
        vendedor: 'Fazenda Orgânica Sol Nascente',
        telefone: '71988776655',
        estoque: 15,
        destaque: true,
        tags: ['orgânico', 'fresco', 'saudável', 'vegetais'],
    },
    {
        id: 'p2',
        nome: 'Bolo de Chocolate com Cobertura',
        descricao: 'Bolo caseiro fofinho com uma generosa camada de cobertura de brigadeiro. Perfeito para o seu café da tarde.',
        preco: 'R$ 35,00',
        categoria: 'Confeitaria',
        imagem: 'https://picsum.photos/seed/p2/400/300',
        vendedor: 'Bolos da Vovó Juju',
        telefone: '71999887766',
        estoque: 8,
        destaque: false,
        tags: ['bolo', 'chocolate', 'doce', 'festa'],
    },
    {
        id: 'p3',
        nome: 'Pano de Prato Bordado à Mão',
        descricao: 'Lindo pano de prato feito em algodão de alta qualidade, com bordados de flores do campo. Peça única.',
        preco: 'R$ 25,00',
        categoria: 'Artesanato',
        imagem: 'https://picsum.photos/seed/p3/400/300',
        vendedor: 'Artesanato Mãos de Fada',
        telefone: '71987654321',
        estoque: 20,
        destaque: true,
        tags: ['artesanato', 'cozinha', 'bordado', 'presente'],
    },
    {
        id: 'p4',
        nome: 'Geleia de Abacaxi com Pimenta',
        descricao: 'Geleia artesanal agridoce, perfeita para acompanhar queijos, torradas e carnes. Feita com ingredientes selecionados.',
        preco: 'R$ 18,00',
        categoria: 'Geleias',
        imagem: 'https://picsum.photos/seed/p4/400/300',
        vendedor: 'Fazenda Orgânica Sol Nascente',
        telefone: '71988776655',
        estoque: 0,
        destaque: false,
        tags: ['geleia', 'artesanal', 'agridoce', 'pimenta'],
    },
     {
        id: 'p5',
        nome: 'Torta de Limão Merengada',
        descricao: 'Uma fatia generosa da nossa famosa torta de limão com base crocante e um merengue suíço maçaricado.',
        preco: 'R$ 15,00 / fatia',
        categoria: 'Confeitaria',
        imagem: 'https://picsum.photos/seed/p5/400/300',
        vendedor: 'Bolos da Vovó Juju',
        telefone: '71999887766',
        estoque: 10,
        destaque: true,
        tags: ['torta', 'limão', 'doce', 'merengue'],
    },
];

export const PLAN_DETAILS = {
    'Básico': {
        price: 'R$ 19,90/mês',
        productLimit: 5,
        features: ['Até 5 produtos', 'Página básica do vendedor', 'Suporte por e-mail'],
    },
    'Premium': {
        price: 'R$ 49,90/mês',
        productLimit: Infinity,
        features: ['Produtos ilimitados', 'Destaque nas buscas', 'Página personalizada', 'Suporte prioritário'],
    },
};


export const SELLER_REVIEWS: SellerReview[] = [
    {
        id: 'r1',
        sellerId: 's1',
        author: 'Ana Silva',
        rating: 5,
        comment: 'Os produtos da Fazenda Sol Nascente são sempre frescos e de ótima qualidade. A entrega é rápida e o atendimento excelente!',
        date: '2024-07-15'
    },
    {
        id: 'r2',
        sellerId: 's1',
        author: 'Carlos Souza',
        rating: 4,
        comment: 'Gostei muito da cesta de orgânicos. Veio bem variada. Só gostaria que tivesse mais opções de frutas.',
        date: '2024-07-10'
    },
    {
        id: 'r3',
        sellerId: 's2',
        author: 'Mariana Costa',
        rating: 5,
        comment: 'O bolo de chocolate da Vovó Juju é simplesmente divino! O melhor que já comi. Super recomendo.',
        date: '2024-07-20'
    },
];
