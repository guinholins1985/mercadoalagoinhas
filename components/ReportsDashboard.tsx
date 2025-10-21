
import React from 'react';
import type { Product, Seller } from '../types';
import { PackageIcon } from './icons/PackageIcon';
import { UsersIcon } from './icons/UsersIcon';
import { ClockIcon } from './icons/ClockIcon';
import { CreditCardIcon } from './icons/CreditCardIcon';

interface ReportsDashboardProps {
    products: Product[];
    sellers: Seller[];
}

const StatCard: React.FC<{title: string; value: string | number; icon: React.ReactNode}> = ({ title, value, icon }) => (
    <div className="bg-slate-100 p-6 rounded-lg flex items-center gap-4">
        <div className="bg-green-200 p-3 rounded-full text-green-700">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

export function ReportsDashboard({ products, sellers }: ReportsDashboardProps) {
    const totalProducts = products.length;
    const totalSellers = sellers.length;
    const pendingSellers = sellers.filter(s => s.status === 'Pendente').length;
    const activeSubscriptions = sellers.filter(s => s.subscriptionStatus === 'Ativa').length;

    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Visão Geral</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total de Produtos" value={totalProducts} icon={<PackageIcon />} />
                <StatCard title="Total de Vendedores" value={totalSellers} icon={<UsersIcon />} />
                <StatCard title="Vendedores Pendentes" value={pendingSellers} icon={<ClockIcon />} />
                <StatCard title="Assinaturas Ativas" value={activeSubscriptions} icon={<CreditCardIcon />} />
            </div>
            <div className="mt-12 text-center">
                <h3 className="text-xl font-semibold text-slate-700">Mais relatórios em breve!</h3>
                <p className="text-slate-500 mt-2">Estamos trabalhando para trazer mais insights para o seu negócio.</p>
            </div>
        </div>
    );
}
