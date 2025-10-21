import React, { useState } from 'react';
import type { User, Product, Seller } from './types';
import { PRODUCTS, USERS, SELLERS } from './constants';
import { LoginPage } from './components/LoginPage';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { ProductList } from './components/ProductList';
import { AdminDashboard } from './components/AdminDashboard';

function App() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [products, setProducts] = useState<Product[]>(PRODUCTS);
    const [sellers, setSellers] = useState<Seller[]>(SELLERS);
    const [searchTerm, setSearchTerm] = useState('');

    const handleLogin = (user: User) => {
        setCurrentUser(user);
    };

    const handleLogout = () => {
        setCurrentUser(null);
    };

    const handleSearch = (query: string) => {
        setSearchTerm(query.toLowerCase());
    };

    // Admin product functions
    const handleAddProduct = (productData: Omit<Product, 'id'>) => {
        const newProduct: Product = {
            id: `p${Date.now()}`,
            ...productData,
        };
        setProducts(prevProducts => [newProduct, ...prevProducts]);
    };

    const handleUpdateProduct = (updatedProduct: Product) => {
        setProducts(prevProducts =>
            prevProducts.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
        );
    };

    const handleDeleteProduct = (productId: string) => {
        setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
    };

    // Admin seller functions
    const handleAddSeller = (sellerData: Omit<Seller, 'id'>) => {
        const newSeller: Seller = {
            id: `s${Date.now()}`,
            ...sellerData,
        };
        setSellers(prevSellers => [newSeller, ...prevSellers]);
    };

    const handleUpdateSeller = (updatedSeller: Seller) => {
        setSellers(prevSellers =>
            prevSellers.map(s => (s.id === updatedSeller.id ? updatedSeller : s))
        );
    };

    const handleDeleteSeller = (sellerId: string) => {
        setSellers(prevSellers => prevSellers.filter(s => s.id !== sellerId));
    };


    const filteredProducts = products.filter(product => {
        const query = searchTerm.trim();
        if (!query) return true;

        const nameMatch = product.nome.toLowerCase().includes(query);
        const categoryMatch = product.categoria.toLowerCase().includes(query);
        const tagMatch = product.tags.some(tag => tag.toLowerCase().includes(query));
        const descriptionMatch = product.descricao.toLowerCase().includes(query);

        return nameMatch || categoryMatch || tagMatch || descriptionMatch;
    });

    if (!currentUser) {
        return <LoginPage onLogin={handleLogin} onRegisterSeller={handleAddSeller} />;
    }

    const isAdmin = currentUser.type === 'admin';

    return (
        <div className="bg-slate-100 min-h-screen font-sans">
            <main className="container mx-auto px-4 py-8 md:py-12">
                <Header user={currentUser} onLogout={handleLogout} />
                
                {isAdmin ? (
                    <AdminDashboard 
                        products={products}
                        sellers={sellers}
                        onAddProduct={handleAddProduct}
                        onUpdateProduct={handleUpdateProduct}
                        onDeleteProduct={handleDeleteProduct}
                        onAddSeller={handleAddSeller}
                        onUpdateSeller={handleUpdateSeller}
                        onDeleteSeller={handleDeleteSeller}
                    />
                ) : (
                    <>
                        <SearchBar onSearch={handleSearch} />
                        <ProductList products={filteredProducts} searchTerm={searchTerm} />
                    </>
                )}
            </main>
        </div>
    );
}

export default App;
