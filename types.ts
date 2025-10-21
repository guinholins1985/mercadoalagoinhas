export interface Product {
    id: number;
    nome: string;
    descricao: string;
    preco: string;
    categoria: string;
    imagem: string;
    vendedor: string;
    telefone: string;
    destaque?: boolean;
    tags?: string[];
}

export interface User {
    type: 'admin' | 'user';
    name: string;
}
