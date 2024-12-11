import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Transaction } from '../../types/finance';
import { formatCurrency } from '../../utils/formatters';

interface MonthlySpendingProps {
  transactions: Transaction[];
}

export function MonthlySpending({ transactions }: MonthlySpendingProps) {
  const monthlyData = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
    
    if (!acc[monthYear]) {
      acc[monthYear] = {
        month: monthYear,
        husband: 0,
        wife: 0,
        total: 0
      };
    }
    
    acc[monthYear][transaction.paidBy] += transaction.amount;
    acc[monthYear].total += transaction.amount;
    
    return acc;
  }, {} as Record<string, { month: string; husband: number; wife: number; total: number; }>);

  const data = Object.values(monthlyData).sort((a, b) => {
    const [aMonth, aYear] = a.month.split('/');
    const [bMonth, bYear] = b.month.split('/');
    return new Date(Number(aYear), Number(aMonth) - 1).getTime() - 
           new Date(Number(bYear), Number(bMonth) - 1).getTime();
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Gastos Mensais</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => formatCurrency(value)} />
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label) => `Mês: ${label}`}
            />
            <Legend />
            <Bar name="Marido" dataKey="husband" fill="#10B981" />
            <Bar name="Esposa" dataKey="wife" fill="#8B5CF6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}