import React from 'react';
import { formatCurrency, formatDate } from '../utils/formatters';
import type { Transaction } from '../types/finance';
import { DollarSign } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

export function TransactionList({ transactions, onDeleteTransaction }: TransactionListProps) {
  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      alimentacao: 'bg-green-100 text-green-800',
      transporte: 'bg-blue-100 text-blue-800',
      moradia: 'bg-yellow-100 text-yellow-800',
      lazer: 'bg-purple-100 text-purple-800',
      viagem: 'bg-orange-100 text-orange-800',
      outros: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.outros;
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <DollarSign className="w-5 h-5 mr-2" />
          Transações Recentes
        </h2>
        
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Nenhuma transação registrada</p>
          ) : (
            transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="font-medium">{transaction.description}</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getCategoryColor(transaction.category)}`}>
                      {transaction.category}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {formatDate(transaction.date)} • Pago por: {transaction.paidBy === 'husband' ? 'Marido' : 'Esposa'}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-semibold">{formatCurrency(transaction.amount)}</span>
                  <button
                    onClick={() => onDeleteTransaction(transaction.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}