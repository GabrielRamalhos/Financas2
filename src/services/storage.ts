import type { Transaction } from '../types/finance';

const STORAGE_KEY = 'finance_transactions';

export const StorageService = {
  saveTransactions(transactions: Transaction[]): void {
    try {
      const data = JSON.stringify(transactions);
      localStorage.setItem(STORAGE_KEY, data);
    } catch (error) {
      console.error('Erro ao salvar transações:', error);
      throw new Error('Não foi possível salvar as transações');
    }
  },

  loadTransactions(): Transaction[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) as Transaction[] : [];
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
      throw new Error('Não foi possível carregar as transações');
    }
  }
};