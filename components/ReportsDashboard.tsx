import React from 'react';
import type { Product, Seller } from '../types';
import { PackageIcon } from './icons/PackageIcon';
import { UsersIcon } from './icons/UsersIcon';
import { ClockIcon } from './icons/ClockIcon';
import { CreditCardIcon } from './icons/CreditCardIcon';
import { StarRating } from './StarRating';


interface ReportsDashboardProps {
    products: Product[];
    sellers: Seller[];
    themeColor: string;
}

const StatCard: React.FC<{title: string; value: string | number; icon: React.ReactNode, themeColor: string}> = ({ title, value, icon, themeColor }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
        <div className={`bg-${themeColor}-100 p-3 rounded-full text-${themeColor}-600`}>
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

export function ReportsDashboard({ products, sellers, themeColor }: ReportsDashboardProps) {
    const totalProducts = products.length;
    const totalSellers = sellers.length;
    const pendingSellers = sellers.filter(s => s.status === 'Pendente').length;
    const activeSubscriptions = sellers.filter(s => s.subscriptionStatus === 'Ativa').length;

    // Mock data for new reports
    const topProducts = [...products].sort((a,b) => b.rating - a.rating).slice(0, 3);
    const sellerPerformance = sellers.map(s => ({
        ...s,
        sales: Math.floor(Math.random() * 5000) + 500, // mock sales data
    })).sort((a,b) => b.sales - a.sales).slice(0, 3);
    const maxSales = Math.max(...sellerPerformance.map(s => s.sales), 0);

    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Visão Geral</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total de Produtos" value={totalProducts} icon={<PackageIcon />} themeColor={themeColor} />
                <StatCard title="Total de Vendedores" value={totalSellers} icon={<UsersIcon />} themeColor={themeColor} />
                <StatCard title="Vendedores Pendentes" value={pendingSellers} icon={<ClockIcon />} themeColor={themeColor} />
                <StatCard title="Assinaturas Ativas" value={activeSubscriptions} icon={<CreditCardIcon />} themeColor={themeColor} />
            </div>

            <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-slate-700 mb-4">Produtos Mais Vendidos (Top 3)</h3>
                    <ul className="space-y-4">
                        {topProducts.map(p => (
                             <li key={p.id} className="flex items-center gap-4">
                                <img src={p.imageUrl} alt={p.name} className="w-12 h-12 rounded-md object-cover" />
                                <div className="flex-grow">
                                    <p className="font-semibold text-slate-800">{p.name}</p>
                                    <p className="text-sm text-slate-500">{p.sellerName}</p>
                                </div>
                                <p className={`font-bold text-${themeColor}-600`}>R$ {p.price.toFixed(2)}</p>
                            </li>
                        ))}
                    </ul>
                </div>
                 <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-slate-700 mb-4">Desempenho dos Vendedores (Top 3)</h3>
                    <ul className="space-y-5">
                        {sellerPerformance.map(s => (
                             <li key={s.id}>
                                <div className="flex justify-between items-center mb-1">
                                    <p className="font-semibold text-slate-800">{s.nomeNegocio}</p>
                                    <p className="text-sm font-medium text-slate-600">
                                        R$ {s.sales.toLocaleString('pt-BR')}
                                    </p>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2.5">
                                    <div 
                                        className={`bg-${themeColor}-500 h-2.5 rounded-full`} 
                                        style={{ width: `${(s.sales / maxSales) * 100}%`}}
                                    ></div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}