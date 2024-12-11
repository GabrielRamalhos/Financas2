import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { NumericFormat } from 'react-number-format';
import type { Transaction } from '../types/finance';

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

export function TransactionForm({ onAddTransaction }: TransactionFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [paidBy, setPaidBy] = useState<'husband' | 'wife'>('husband');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onAddTransaction({
      description,
      amount: Number(amount.replace(/\D/g, '')) / 100,
      category,
      date: new Date().toISOString(),
      paidBy
    });

    setDescription('');
    setAmount('');
    setCategory('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Adicionar Nova Despesa</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Descrição</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Valor</label>
          <NumericFormat
            value={amount}
            onValueChange={(values) => setAmount(values.value)}
            thousandSeparator="."
            decimalSeparator=","
            prefix="R$ "
            decimalScale={2}
            fixedDecimalScale
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Categoria</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Selecione uma categoria</option>
            <option value="alimentacao">Alimentação</option>
            <option value="transporte">Transporte</option>
            <option value="moradia">Moradia</option>
            <option value="lazer">Lazer</option>
            <option value="viagem">Viagem</option>
            <option value="outros">Outros</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Pago por</label>
          <div className="mt-1 space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="husband"
                checked={paidBy === 'husband'}
                onChange={(e) => setPaidBy(e.target.value as 'husband' | 'wife')}
                className="form-radio text-blue-500"
              />
              <span className="ml-2">Marido</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="wife"
                checked={paidBy === 'wife'}
                onChange={(e) => setPaidBy(e.target.value as 'husband' | 'wife')}
                className="form-radio text-blue-500"
              />
              <span className="ml-2">Esposa</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Adicionar Despesa
        </button>
      </div>
    </form>
  );
}