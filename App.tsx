import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { ProductList } from './components/ProductList';
import { LoginPage } from './components/LoginPage';
import { AdminDashboard } from './components/AdminDashboard';
import { produtos as initialProducts } from './constants';
import type { Product, User } from './types';

function App() {
    const [user, setUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [products, setProducts] = useState<Product[]>(initialProducts);

    const handleLogin = (loggedInUser: User) => {
        setUser(loggedInUser);
    };

    const handleLogout = () => {
        setUser(null);
        setSearchTerm(''); // Reset search on logout
    };

    const handleAddProduct = (newProductData: Omit<Product, 'id'>) => {
        setProducts(prevProducts => {
            const newId = prevProducts.length > 0 ? Math.max(...prevProducts.map(p => p.id)) + 1 : 1;
            const newProduct: Product = { id: newId, ...newProductData };
            return [...prevProducts, newProduct];
        });
    };

    const handleUpdateProduct = (updatedProduct: Product) => {
        setProducts(prevProducts =>
            prevProducts.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
        );
    };

    const handleDeleteProduct = (productId: number) => {
        setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
    };

    const sortedProducts = useMemo(() => {
        // Create a copy before sorting to avoid mutating the original array
        return [...products].sort((a, b) => {
            if (a.destaque && !b.destaque) return -1; // a comes first
            if (!a.destaque && b.destaque) return 1;  // b comes first
            return 0; // maintain original order
        });
    }, [products]);

    const filteredProducts = useMemo<Product[]>(() => {
        if (!searchTerm.trim()) {
            return sortedProducts;
        }

        const lowercasedTerm = searchTerm.toLowerCase();
        return sortedProducts.filter(produto =>
            produto.nome.toLowerCase().includes(lowercasedTerm) ||
            produto.descricao.toLowerCase().includes(lowercasedTerm) ||
            produto.categoria.toLowerCase().includes(lowercasedTerm) ||
            produto.tags?.some(tag => tag.toLowerCase().includes(lowercasedTerm))
        );
    }, [searchTerm, sortedProducts]);


    const handleSearch = (query: string) => {
        setSearchTerm(query);
    };

    // Render logic based on auth state and user type
    if (!user) {
        return <LoginPage onLogin={handleLogin} />;
    }

    if (user.type === 'admin') {
        return <AdminDashboard 
                    user={user} 
                    onLogout={handleLogout} 
                    products={products}
                    onAddProduct={handleAddProduct}
                    onUpdateProduct={handleUpdateProduct}
                    onDeleteProduct={handleDeleteProduct}
                />;
    }

    return (
        <div className="min-h-screen bg-slate-100 text-slate-800">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
                <Header user={user} onLogout={handleLogout} />
                <main>
                    <SearchBar onSearch={handleSearch} />
                    <ProductList products={filteredProducts} searchTerm={searchTerm} />
                </main>
            </div>
        </div>
    );
}

export default App;
