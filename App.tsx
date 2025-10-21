import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { ProductList } from './components/ProductList';
import { LoginPage } from './components/LoginPage';
import { AdminDashboard } from './components/AdminDashboard';
import { Banner } from './components/Banner';
import { PRODUCTS, USERS, SELLERS, BANNER_IMAGES } from './constants';
import type { User, Product, Seller, AppearanceSettings } from './types';
import { storage } from './utils/storage';

// Keys for localStorage
const STORAGE_KEYS = {
  PRODUCTS: 'mercado_products',
  SELLERS: 'mercado_sellers',
  APPEARANCE: 'mercado_appearance',
};

// Default appearance settings
const defaultAppearance: AppearanceSettings = {
  bannerImages: BANNER_IMAGES,
  storeName: 'Mercado Alagoinhas',
  themeColor: 'green',
  logoUrl: null as string | null,
  logoSize: 40, // Default logo height in px
  centerLogo: false, // Default logo alignment
};


function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  // App data state now hydrated from localStorage
  const [products, setProducts] = useState<Product[]>(() => storage.getItem(STORAGE_KEYS.PRODUCTS, PRODUCTS));
  const [sellers, setSellers] = useState<Seller[]>(() => storage.getItem(STORAGE_KEYS.SELLERS, SELLERS));
  const [appearance, setAppearance] = useState<AppearanceSettings>(() => storage.getItem(STORAGE_KEYS.APPEARANCE, defaultAppearance));

  // Update localStorage whenever data changes
  useEffect(() => {
    storage.setItem(STORAGE_KEYS.PRODUCTS, products);
  }, [products]);

  useEffect(() => {
    storage.setItem(STORAGE_KEYS.SELLERS, sellers);
  }, [sellers]);

  useEffect(() => {
    storage.setItem(STORAGE_KEYS.APPEARANCE, appearance);
  }, [appearance]);

  
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
  
  const handleSaveChanges = (newSettings: AppearanceSettings) => {
    setAppearance(newSettings);
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
        storeName={appearance.storeName}
        themeColor={appearance.themeColor}
        logoUrl={appearance.logoUrl}
        logoSize={appearance.logoSize}
        centerLogo={appearance.centerLogo}
      />
      <main className="container mx-auto px-4 pb-12">
        {currentUser?.type === 'admin' ? (
          <AdminDashboard 
            initialProducts={products}
            onProductsChange={setProducts}
            initialSellers={sellers}
            onSellersChange={setSellers}
            initialAppearance={appearance}
            onSaveChanges={handleSaveChanges}
            onLogout={handleLogout}
          />
        ) : (
          <>
            <SearchBar onSearch={handleSearch} themeColor={appearance.themeColor} />
            <Banner images={appearance.bannerImages} />
            <div className="mt-8 md:mt-12">
                <ProductList products={filteredProducts} searchTerm={searchTerm} themeColor={appearance.themeColor} />
            </div>
          </>
        )}
      </main>
      <LoginPage 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
        users={USERS}
        storeName={appearance.storeName}
        themeColor={appearance.themeColor}
        logoUrl={appearance.logoUrl}
      />
    </div>
  );
}

export default App;
