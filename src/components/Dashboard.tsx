import React from 'react';
import { formatCurrency } from '../utils/formatters';
import type { Transaction } from '../types/finance';
import { TrendingUp, DollarSign } from 'lucide-react';
import { SpendingByCategory } from './charts/SpendingByCategory';
import { MonthlySpending } from './charts/MonthlySpending';

interface DashboardProps {
  transactions: Transaction[];
}

export function Dashboard({ transactions }: DashboardProps) {
  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  const husbandTotal = transactions
    .filter(t => t.paidBy === 'husband')
    .reduce((sum, t) => sum + t.amount, 0);
  const wifeTotal = transactions
    .filter(t => t.paidBy === 'wife')
    .reduce((sum, t) => sum + t.amount, 0);

  const stats = [
    {
      title: 'Total de Gastos',
      value: formatCurrency(totalAmount),
      icon: TrendingUp,
      color: 'bg-blue-500'
    },
    {
      title: 'Gastos do Marido',
      value: formatCurrency(husbandTotal),
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Gastos da Esposa',
      value: formatCurrency(wifeTotal),
      icon: DollarSign,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="space-y-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-semibold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingByCategory transactions={transactions} />
        <MonthlySpending transactions={transactions} />
      </div>
    </div>
  );
}