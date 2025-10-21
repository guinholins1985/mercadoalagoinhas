import React, { useMemo, useState } from 'react';
import type { Transaction } from '../types';
import { DownloadIcon } from './icons/DownloadIcon';
import { getThemeClasses } from '../utils/theme';

const StatCard: React.FC<{title: string; value: string; extra?: string}> = ({ title, value, extra }) => (
    <div className="bg-white p-4 rounded-lg shadow-md">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-xl font-bold text-slate-800 mt-1">{value}</p>
        {extra && <p className="text-xs text-slate-400 mt-1">{extra}</p>}
    </div>
);

// Vercel/Tailwind JIT Fix: This component ensures that all Tailwind classes are static strings.
// Dynamically constructed class names like `bg-${color}-100` are not detected by the JIT compiler.
const StatusBadge: React.FC<{ status: Transaction['status']; themeColor: string }> = ({ status, themeColor }) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";

    if (status === 'Pendente') {
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>{status}</span>;
    }
    if (status === 'Rejeitado') {
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>{status}</span>;
    }
    
    // Handle 'Aprovado' status with theme-sensitive colors
    switch (themeColor) {
        case 'green':
            return <span className={`${baseClasses} bg-green-100 text-green-800`}>{status}</span>;
        case 'blue':
            return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>{status}</span>;
        case 'orange':
            return <span className={`${baseClasses} bg-orange-100 text-orange-800`}>{status}</span>;
        case 'purple':
            return <span className={`${baseClasses} bg-purple-100 text-purple-800`}>{status}</span>;
        case 'pink':
            return <span className={`${baseClasses} bg-pink-100 text-pink-800`}>{status}</span>;
        default:
            return <span className={`${baseClasses} bg-green-100 text-green-800`}>{status}</span>;
    }
};


export function FinancialDashboard({ transactions, themeColor }: { transactions: Transaction[], themeColor: string }) {
    const [statusFilter, setStatusFilter] = useState('all');
    const theme = getThemeClasses(themeColor);

    const filteredTransactions = useMemo(() => {
        if (statusFilter === 'all') {
            return transactions;
        }
        return transactions.filter(t => t.status.toLowerCase() === statusFilter);
    }, [transactions, statusFilter]);

    const stats = useMemo(() => {
        const approved = transactions.filter(t => t.status === 'Aprovado');
        const totalRevenue = approved.reduce((sum, t) => sum + t.amount, 0);
        const totalFees = approved.reduce((sum, t) => sum + t.fee, 0);
        return {
            totalRevenue,
            totalFees,
            netRevenue: totalRevenue - totalFees,
            transactionCount: approved.length,
        }
    }, [transactions]);
    
    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    
    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Relatório Financeiro</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Receita Bruta" value={formatCurrency(stats.totalRevenue)} extra={`${stats.transactionCount} vendas aprovadas`} />
                <StatCard title="Taxas Arrecadadas" value={formatCurrency(stats.totalFees)} extra="Taxa de 5% por transação"/>
                <StatCard title="Receita Líquida" value={formatCurrency(stats.netRevenue)} />
                <StatCard title="Vendas Rejeitadas" value={transactions.filter(t => t.status === 'Rejeitado').length.toString()} />
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h3 className="text-lg font-semibold text-slate-700">Histórico de Transações</h3>
                    <div className="flex items-center gap-4">
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className={`bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-1 ${theme.focusRing500} ${theme.border500} block w-full p-2`}
                        >
                            <option value="all">Todos os Status</option>
                            <option value="aprovado">Aprovado</option>
                            <option value="pendente">Pendente</option>
                            <option value="rejeitado">Rejeitado</option>
                        </select>
                         <button className="flex items-center gap-2 px-3 py-2 bg-slate-200 text-slate-700 font-semibold rounded-md hover:bg-slate-300 text-sm">
                            <DownloadIcon /> Exportar
                        </button>
                    </div>
                </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Data</th>
                                <th scope="col" className="px-6 py-3">Vendedor</th>
                                <th scope="col" className="px-6 py-3">Produto</th>
                                <th scope="col" className="px-6 py-3">Valor Bruto</th>
                                <th scope="col" className="px-6 py-3">Taxa (5%)</th>
                                <th scope="col" className="px-6 py-3">Valor Líquido</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map(t => (
                                <tr key={t.id} className="bg-white border-b hover:bg-slate-50">
                                    <td className="px-6 py-4">{new Date(t.date).toLocaleDateString('pt-BR')}</td>
                                    <td className="px-6 py-4 font-medium text-slate-900">{t.sellerName}</td>
                                    <td className="px-6 py-4">{t.productName}</td>
                                    <td className="px-6 py-4">{formatCurrency(t.amount)}</td>
                                    <td className="px-6 py-4 text-red-600">-{formatCurrency(t.fee)}</td>
                                    <td className={`px-6 py-4 font-semibold ${theme.text700}`}>{formatCurrency(t.netAmount)}</td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={t.status} themeColor={themeColor} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}