import asyncHandler from 'express-async-handler';
import { getDatabase } from '../database/init.js';
import { generateId } from '../utils/ids.js';

export const getTransactions = asyncHandler(async (req, res) => {
  const db = getDatabase();
  const transactions = db.prepare(`
    SELECT * FROM transactions 
    WHERE user_id = ? 
    ORDER BY date DESC
  `).all(req.user.id);
  
  // Ensure all date strings are valid ISO format
  const formattedTransactions = transactions.map(transaction => ({
    ...transaction,
    date: new Date(transaction.date).toISOString()
  }));
  
  res.json(formattedTransactions);
});

export const createTransaction = asyncHandler(async (req, res) => {
  const db = getDatabase();
  const { description, amount, category, date, paidBy } = req.body;
  const transactionId = generateId();

  // Ensure date is in ISO format
  const isoDate = new Date(date).toISOString();

  db.prepare(`
    INSERT INTO transactions (id, user_id, description, amount, category, date, paid_by)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(transactionId, req.user.id, description, amount, category, isoDate, paidBy);

  const transaction = db.prepare('SELECT * FROM transactions WHERE id = ?').get(transactionId);
  res.status(201).json({
    ...transaction,
    date: new Date(transaction.date).toISOString()
  });
});

export const deleteTransaction = asyncHandler(async (req, res) => {
  const db = getDatabase();
  const { id } = req.params;

  const transaction = db.prepare(`
    SELECT * FROM transactions WHERE id = ? AND user_id = ?
  `).get(id, req.user.id);

  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found');
  }

  db.prepare('DELETE FROM transactions WHERE id = ?').run(id);
  res.json({ id });
});

export const importTransactions = asyncHandler(async (req, res) => {
  const db = getDatabase();
  const transactions = req.body;

  const stmt = db.prepare(`
    INSERT INTO transactions (id, user_id, description, amount, category, date, paid_by)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const importMany = db.transaction((transactions) => {
    for (const transaction of transactions) {
      const isoDate = new Date(transaction.date).toISOString();
      stmt.run(
        generateId(),
        req.user.id,
        transaction.description,
        transaction.amount,
        transaction.category,
        isoDate,
        transaction.paidBy
      );
    }
  });

  importMany(transactions);
  res.status(201).json({ message: 'Transactions imported successfully' });
});