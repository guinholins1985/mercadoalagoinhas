import React, { useRef } from 'react';
import type { AppearanceSettings } from '../types';
import { DeleteIcon } from './icons/DeleteIcon';
import { PlusIcon } from './icons/PlusIcon';
import { CheckIcon } from './icons/CheckIcon';
import { getThemeClasses } from '../utils/theme';

interface AppearanceDashboardProps {
    settings: AppearanceSettings;
    onSettingsChange: (settings: AppearanceSettings) => void;
}

const availableThemes = [
    { name: 'Verde', value: 'green', class: 'bg-green-600' },
    { name: 'Azul', value: 'blue', class: 'bg-blue-600' },
    { name: 'Laranja', value: 'orange', class: 'bg-orange-600' },
    { name: 'Roxo', value: 'purple', class: 'bg-purple-600' },
    { name: 'Rosa', value: 'pink', class: 'bg-pink-600' },
];

// Helper to read file as Base64
const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

const ToggleSwitch: React.FC<{ enabled: boolean; onChange: () => void; themeClasses: ReturnType<typeof getThemeClasses> }> = ({ enabled, onChange, themeClasses }) => {
    return (
        <button
            type="button"
            onClick={onChange}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                enabled ? themeClasses.bg600 : 'bg-slate-300'
            }`}
        >
            <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                    enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
        </button>
    );
};

export function AppearanceDashboard({
    settings,
    onSettingsChange,
}: AppearanceDashboardProps) {

    const fileInputRef = useRef<HTMLInputElement>(null);
    const theme = getThemeClasses(settings.themeColor);

    const handleSettingChange = <K extends keyof AppearanceSettings>(key: K, value: AppearanceSettings[K]) => {
        onSettingsChange({ ...settings, [key]: value });
    };

    const handleBannerChange = (index: number, value: string) => {
        const newBanners = [...settings.bannerImages];
        newBanners[index] = value;
        handleSettingChange('bannerImages', newBanners);
    };

    const handleAddBanner = () => {
        handleSettingChange('bannerImages', [...settings.bannerImages, '']);
    };

    const handleRemoveBanner = (index: number) => {
        const newBanners = settings.bannerImages.filter((_, i) => i !== index);
        handleSettingChange('bannerImages', newBanners);
    };

    const handleLogoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
           try {
               const base64 = await toBase64(file);
               handleSettingChange('logoUrl', base64);
           } catch (error) {
               console.error("Error converting file to base64", error);
               alert("Não foi possível carregar a imagem.");
           }
        }
    };

    const handleRemoveLogo = () => {
        handleSettingChange('logoUrl', null);
    };
    
    const inputClasses = `border border-slate-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 ${theme.focusRing500} focus:border-transparent`;

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
                        {settings.bannerImages.map((url, index) => (
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
                    <h3 className="text-lg font-semibold text-slate-700 mb-4">Identidade Visual e Layout</h3>
                    <div className="space-y-6">
                         <div>
                            <label className="block text-sm font-medium text-slate-700">Logo da Loja</label>
                            <div className="mt-2 flex items-center gap-4">
                                <div className="w-28 h-14 flex items-center justify-center bg-slate-100 rounded border p-1">
                                    {settings.logoUrl ? (
                                        <img src={settings.logoUrl} alt="Logo da loja" className="max-w-full max-h-full object-contain" />
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
                                {settings.logoUrl && (
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
                            <label htmlFor="logoSize" className="block text-sm font-medium text-slate-700">
                                Tamanho da Logo (Altura): <span className="font-bold">{settings.logoSize}px</span>
                            </label>
                            <input
                                type="range"
                                id="logoSize"
                                value={settings.logoSize}
                                onChange={(e) => handleSettingChange('logoSize', parseInt(e.target.value, 10))}
                                min="24"
                                max="80"
                                step="1"
                                className="mt-1 w-full max-w-sm h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Layout do Cabeçalho</label>
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md max-w-sm">
                                <span className="font-medium text-slate-600">Centralizar logo</span>
                                <ToggleSwitch
                                    enabled={settings.centerLogo}
                                    onChange={() => handleSettingChange('centerLogo', !settings.centerLogo)}
                                    themeClasses={theme}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="storeName" className="block text-sm font-medium text-slate-700">Nome da Loja (usado se não houver logo)</label>
                            <input
                                type="text"
                                id="storeName"
                                value={settings.storeName}
                                onChange={(e) => handleSettingChange('storeName', e.target.value)}
                                className={`mt-1 block w-full max-w-sm ${inputClasses}`}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Cor Principal do Tema</label>
                            <div className="mt-2 flex flex-wrap gap-3">
                                {availableThemes.map(themeOption => (
                                    <button
                                        key={themeOption.value}
                                        onClick={() => handleSettingChange('themeColor', themeOption.value)}
                                        className={`relative w-24 h-12 rounded-md ${themeOption.class} flex items-center justify-center text-white font-semibold text-sm transition-transform hover:scale-105`}
                                        aria-label={`Selecionar tema ${themeOption.name}`}
                                    >
                                        {themeOption.name}
                                        {settings.themeColor === themeOption.value && (
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
