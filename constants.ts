import type { Product } from './types';

export const produtos: Product[] = [
    {
        id: 1,
        nome: "Cesta de Palha Artesanal",
        descricao: "Cesta trançada à mão, ideal para decoração ou piqueniques.",
        preco: "R$ 40,00",
        categoria: "Artesanato",
        imagem: "https://picsum.photos/seed/cesta/400/300",
        vendedor: "Maria Artesã",
        telefone: "71999999999",
        tags: ["decoração", "piquenique", "rústico", "natural"]
    },
    {
        id: 2,
        nome: "Abacaxi Orgânico",
        descricao: "Abacaxi Pérola cultivado sem agrotóxicos, doce e suculento.",
        preco: "R$ 5,00",
        categoria: "Alimentos",
        imagem: "https://picsum.photos/seed/abacaxi/400/300",
        vendedor: "Sítio do João",
        telefone: "71988888888",
        tags: ["fruta", "orgânico", "saudável"]
    },
    {
        id: 3,
        nome: "Bolo de Chocolate Caseiro",
        descricao: "Bolo fofinho feito com chocolate belga e ingredientes frescos.",
        preco: "R$ 30,00",
        categoria: "Alimentos",
        imagem: "https://picsum.photos/seed/bolo/400/300",
        vendedor: "Doces da Ana",
        telefone: "71977777777",
        destaque: true,
        tags: ["doce", "festa", "sobremesa", "chocolate"]
    },
    {
        id: 4,
        nome: "Sabonete Artesanal de Ervas",
        descricao: "Sabonete de lavanda feito com ervas naturais e óleos essenciais.",
        preco: "R$ 8,00",
        categoria: "Cosméticos",
        imagem: "https://picsum.photos/seed/sabonete/400/300",
        vendedor: "Aromas do Carlos",
        telefone: "71966666666",
        tags: ["vegano", "natural", "banho", "lavanda"]
    },
    {
        id: 5,
        nome: "Pão de Fermentação Natural",
        descricao: "Pão rústico com casca crocante e miolo macio. Longa fermentação.",
        preco: "R$ 20,00",
        categoria: "Alimentos",
        imagem: "https://picsum.photos/seed/pao/400/300",
        vendedor: "Padoca do Bairro",
        telefone: "71955555555",
        tags: ["padaria", "artesanal", "café da manhã"]
    },
    {
        id: 6,
        nome: "Vaso de Cerâmica Pintado",
        descricao: "Vaso decorativo de cerâmica, pintado à mão com motivos florais.",
        preco: "R$ 55,00",
        categoria: "Artesanato",
        imagem: "https://picsum.photos/seed/vaso/400/300",
        vendedor: "Maria Artesã",
        telefone: "71999999999",
        destaque: true,
        tags: ["decoração", "jardim", "feito à mão", "cerâmica"]
    }
];
