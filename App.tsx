import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { ProductList } from './components/ProductList';
import { LoginPage } from './components/LoginPage';
import { AdminDashboard } from './components/AdminDashboard';
import { Banner } from './components/Banner';
import { PRODUCTS, USERS, SELLERS, BANNER_IMAGES } from './constants';
import type { User, Product, Seller } from './types';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  // In a real app, this data would come from an API
  const [products] = useState<Product[]>(PRODUCTS);
  const [sellers] = useState<Seller[]>(SELLERS);

  // New state for appearance
  const [bannerImages, setBannerImages] = useState<string[]>(BANNER_IMAGES);
  const [storeName, setStoreName] = useState('Mercado Alagoinhas');
  const [themeColor, setThemeColor] = useState('green');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleSearch = (query: string) => {
    setSearchTerm(query.toLowerCase());
  };

  const handleSaveChanges = (settings: {
    bannerImages: string[];
    storeName: string;
    themeColor: string;
    logoUrl: string | null;
  }) => {
    setBannerImages(settings.bannerImages);
    setStoreName(settings.storeName);
    setThemeColor(settings.themeColor);
    setLogoUrl(settings.logoUrl);
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

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <Header 
        user={currentUser} 
        onLogout={handleLogout} 
        onLoginClick={() => setIsLoginModalOpen(true)}
        storeName={storeName}
        themeColor={themeColor}
        logoUrl={logoUrl}
      />
      <main className="container mx-auto px-4 pb-12">
        {currentUser?.type === 'admin' ? (
          <AdminDashboard 
            initialProducts={products} 
            initialSellers={sellers}
            initialBannerImages={bannerImages}
            initialStoreName={storeName}
            initialThemeColor={themeColor}
            initialLogoUrl={logoUrl}
            onSaveChanges={handleSaveChanges}
            onLogout={handleLogout}
          />
        ) : (
          <>
            <SearchBar onSearch={handleSearch} themeColor={themeColor} />
            <Banner images={bannerImages} />
            <div className="mt-8 md:mt-12">
                <ProductList products={filteredProducts} searchTerm={searchTerm} themeColor={themeColor} />
            </div>
          </>
        )}
      </main>
      <LoginPage 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
        users={USERS}
        storeName={storeName}
        themeColor={themeColor}
        logoUrl={logoUrl}
      />
    </div>
  );
}

export default App;