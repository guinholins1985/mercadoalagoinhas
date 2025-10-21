import React, { useState, useEffect } from 'react';
import type { Product, Seller, AppearanceSettings } from '../types';
import { getThemeClasses } from '../utils/theme';

interface DataDashboardProps {
    products: Product[];
    sellers: Seller[];
    appearance: AppearanceSettings;
    onProductsChange: (products: Product[]) => void;
    onSellersChange: (sellers: Seller[]) => void;
    onAppearanceChange: (settings: AppearanceSettings) => void;
    themeColor: string;
}

const DataSection: React.FC<{
    title: string;
    data: object;
    onSave: (data: any) => void;
    themeColor: string;
}> = ({ title, data, onSave, themeColor }) => {
    const [jsonText, setJsonText] = useState(JSON.stringify(data, null, 2));
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const theme = getThemeClasses(themeColor);

    useEffect(() => {
        setJsonText(JSON.stringify(data, null, 2));
    }, [data]);
    
    const handleSave = () => {
        setError(null);
        setSuccess(false);
        try {
            const parsedData = JSON.parse(jsonText);
            onSave(parsedData);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 2000);
        } catch (e: any) {
            setError(`JSON inválido: ${e.message}`);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-slate-700 mb-4">{title}</h3>
            <textarea
                className={`w-full h-80 p-3 font-mono text-xs bg-slate-50 border rounded-md focus:outline-none focus:ring-2 ${theme.focusRing500} ${error ? 'border-red-500' : 'border-slate-300'}`}
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                spellCheck="false"
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            <div className="mt-4 flex items-center gap-4">
                 <button
                    onClick={handleSave}
                    className={`px-4 py-2 text-white font-semibold rounded-md transition-colors ${theme.bg600} ${theme.hoverBg700}`}
                >
                    Salvar {title}
                </button>
                 {success && <span className={`text-sm font-medium ${theme.text600}`}>Salvo com sucesso!</span>}
            </div>
        </div>
    );
};

export function DataDashboard({
    products,
    sellers,
    appearance,
    onProductsChange,
    onSellersChange,
    onAppearanceChange,
    themeColor
}: DataDashboardProps) {
    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Gerenciamento de Dados</h2>
            <p className="text-slate-600 mb-6">
                Visualize e edite os dados brutos da aplicação. Cuidado, alterações aqui são salvas diretamente.
            </p>
            <div className="space-y-8">
                <DataSection 
                    title="Produtos" 
                    data={products} 
                    onSave={onProductsChange}
                    themeColor={themeColor}
                />
                <DataSection 
                    title="Vendedores" 
                    data={sellers} 
                    onSave={onSellersChange}
                    themeColor={themeColor}
                />
                <DataSection 
                    title="Aparência" 
                    data={appearance}
                    onSave={onAppearanceChange}
                    themeColor={themeColor}
                />
            </div>
        </div>
    );
}
