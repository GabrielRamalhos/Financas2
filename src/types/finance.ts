export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  paidBy: 'husband' | 'wife';
}

export interface Category {
  id: string;
  name: string;
  color: string;
}