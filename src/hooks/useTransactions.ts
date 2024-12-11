import { useState, useEffect } from 'react';
import { Transaction } from '../types/finance';
import { FileStorage } from '../services/storage/fileStorage';
import { generateId } from '../utils/ids';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = () => {
    try {
      setIsLoading(true);
      const loadedTransactions = FileStorage.loadTransactions();
      setTransactions(loadedTransactions);
      setError(null);
    } catch (err) {
      setError('Error loading transactions');
    } finally {
      setIsLoading(false);
    }
  };

  const addTransaction = async (newTransaction: Omit<Transaction, 'id'>) => {
    try {
      const transaction: Transaction = {
        ...newTransaction,
        id: generateId(),
        date: new Date().toISOString()
      };
      const updatedTransactions = [transaction, ...transactions];
      FileStorage.saveTransactions(updatedTransactions);
      setTransactions(updatedTransactions);
      setError(null);
    } catch (err) {
      setError('Error adding transaction');
      throw err;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const updatedTransactions = transactions.filter(t => t.id !== id);
      FileStorage.saveTransactions(updatedTransactions);
      setTransactions(updatedTransactions);
      setError(null);
    } catch (err) {
      setError('Error deleting transaction');
      throw err;
    }
  };

  const importTransactions = async (file: File) => {
    try {
      const importedTransactions = await FileStorage.importFromFile(file);
      setTransactions(importedTransactions);
      setError(null);
    } catch (err) {
      setError('Error importing transactions');
      throw err;
    }
  };

  const exportTransactions = () => {
    try {
      FileStorage.exportToFile(transactions);
      setError(null);
    } catch (err) {
      setError('Error exporting transactions');
      throw err;
    }
  };

  return {
    transactions,
    isLoading,
    error,
    addTransaction,
    deleteTransaction,
    importTransactions,
    exportTransactions
  };
}