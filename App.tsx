
import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { ProductList } from './components/ProductList';
import { LoginPage } from './components/LoginPage';
import { AdminDashboard } from './components/AdminDashboard';
import { PRODUCTS, USERS, SELLERS } from './constants';
import type { User, Product, Seller } from './types';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // In a real app, this data would come from an API
  const [products] = useState<Product[]>(PRODUCTS);
  const [sellers] = useState<Seller[]>(SELLERS);
  
  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleSearch = (query: string) => {
    setSearchTerm(query.toLowerCase());
  };

  const filteredProducts = useMemo(() => {
    if (!searchTerm) {
      return products;
    }
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.sellerName.toLowerCase().includes(searchTerm)
    );
  }, [products, searchTerm]);

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} users={USERS} />;
  }

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <Header user={currentUser} onLogout={handleLogout} />
      <main className="container mx-auto px-4 pb-12">
        {currentUser.type === 'admin' ? (
          <AdminDashboard initialProducts={products} initialSellers={sellers} />
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
