import React, { useRef } from 'react';
import { DeleteIcon } from './icons/DeleteIcon';
import { PlusIcon } from './icons/PlusIcon';
import { CheckIcon } from './icons/CheckIcon';

interface AppearanceDashboardProps {
    bannerImages: string[];
    onBannerImagesChange: (images: string[]) => void;
    storeName: string;
    onStoreNameChange: (name: string) => void;
    themeColor: string;
    onThemeColorChange: (color: string) => void;
    logoUrl: string | null;
    onLogoUrlChange: (url: string | null) => void;
}

const availableThemes = [
    { name: 'Verde', value: 'green', class: 'bg-green-600' },
    { name: 'Azul', value: 'blue', class: 'bg-blue-600' },
    { name: 'Laranja', value: 'orange', class: 'bg-orange-600' },
    { name: 'Roxo', value: 'purple', class: 'bg-purple-600' },
    { name: 'Rosa', value: 'pink', class: 'bg-pink-600' },
];

export function AppearanceDashboard({
    bannerImages,
    onBannerImagesChange,
    storeName,
    onStoreNameChange,
    themeColor,
    onThemeColorChange,
    logoUrl,
    onLogoUrlChange,
}: AppearanceDashboardProps) {

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleBannerChange = (index: number, value: string) => {
        const newBanners = [...bannerImages];
        newBanners[index] = value;
        onBannerImagesChange(newBanners);
    };

    const handleAddBanner = () => {
        onBannerImagesChange([...bannerImages, '']);
    };

    const handleRemoveBanner = (index: number) => {
        const newBanners = bannerImages.filter((_, i) => i !== index);
        onBannerImagesChange(newBanners);
    };

    const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (logoUrl?.startsWith('blob:')) {
                URL.revokeObjectURL(logoUrl);
            }
            onLogoUrlChange(URL.createObjectURL(file));
        }
    };

    const handleRemoveLogo = () => {
        if (logoUrl?.startsWith('blob:')) {
            URL.revokeObjectURL(logoUrl);
        }
        onLogoUrlChange(null);
    };
    
    const inputClasses = `border border-slate-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-${themeColor}-500 focus:border-transparent`;

    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Aparência da Loja</h2>
            
            <div className="space-y-8">
                {/* Banner Management */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-slate-700 mb-4">Gerenciar Banners</h3>
                    <p className="text-sm text-slate-600 mb-6">
                        Adicione, edite ou remova as imagens que aparecem no carrossel da página inicial.
                    </p>
                    <div className="space-y-3">
                        {bannerImages.map((url, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <img 
                                    src={url || 'https://via.placeholder.com/150'} 
                                    alt={`Preview ${index + 1}`} 
                                    className="w-24 h-12 rounded object-cover bg-slate-200"
                                    onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150')}
                                />
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => handleBannerChange(index, e.target.value)}
                                    placeholder="https://exemplo.com/imagem.png"
                                    className={`flex-grow ${inputClasses}`}
                                />
                                <button
                                    onClick={() => handleRemoveBanner(index)}
                                    className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                                    aria-label="Remover banner"
                                >
                                    <DeleteIcon />
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={handleAddBanner}
                        className={`mt-4 flex items-center gap-2 px-4 py-2 bg-slate-700 text-white font-semibold rounded-md hover:bg-slate-800`}
                    >
                        <PlusIcon /> Adicionar Banner
                    </button>
                </div>

                {/* Logo and Template Settings */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-slate-700 mb-4">Identidade Visual</h3>
                    <div className="space-y-6">
                         <div>
                            <label className="block text-sm font-medium text-slate-700">Logo da Loja</label>
                            <div className="mt-2 flex items-center gap-4">
                                <div className="w-28 h-14 flex items-center justify-center bg-slate-100 rounded border p-1">
                                    {logoUrl ? (
                                        <img src={logoUrl} alt="Logo da loja" className="max-w-full max-h-full object-contain" />
                                    ) : (
                                        <span className="text-xs text-slate-500 text-center">Sem logo</span>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleLogoChange}
                                    accept="image/png, image/jpeg, image/gif, image/svg+xml"
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`px-3 py-1.5 text-sm bg-white border border-slate-300 text-slate-700 font-semibold rounded-md hover:bg-slate-50`}
                                >
                                    Alterar Logo
                                </button>
                                {logoUrl && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveLogo}
                                        className="text-sm text-red-600 hover:underline"
                                    >
                                        Remover
                                    </button>
                                )}
                            </div>
                            <p className="mt-1 text-xs text-slate-500">Recomendado: imagem horizontal (.png ou .svg com fundo transparente).</p>
                        </div>
                        <div>
                            <label htmlFor="storeName" className="block text-sm font-medium text-slate-700">Nome da Loja (usado se não houver logo)</label>
                            <input
                                type="text"
                                id="storeName"
                                value={storeName}
                                onChange={(e) => onStoreNameChange(e.target.value)}
                                className={`mt-1 block w-full max-w-sm ${inputClasses}`}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Cor Principal do Tema</label>
                            <div className="mt-2 flex flex-wrap gap-3">
                                {availableThemes.map(theme => (
                                    <button
                                        key={theme.value}
                                        onClick={() => onThemeColorChange(theme.value)}
                                        className={`relative w-24 h-12 rounded-md ${theme.class} flex items-center justify-center text-white font-semibold text-sm transition-transform hover:scale-105`}
                                        aria-label={`Selecionar tema ${theme.name}`}
                                    >
                                        {theme.name}
                                        {themeColor === theme.value && (
                                            <div className="absolute inset-0 bg-black/30 rounded-md flex items-center justify-center">
                                                <CheckIcon />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}