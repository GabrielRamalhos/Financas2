import express from 'express';
import { 
  getTransactions, 
  createTransaction, 
  deleteTransaction,
  importTransactions 
} from '../controllers/transactions.js';
import { authenticate } from '../middleware/auth.js';
import { validateTransaction } from '../middleware/validation.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getTransactions);
router.post('/', validateTransaction, createTransaction);
router.delete('/:id', deleteTransaction);
router.post('/import', importTransactions);

export { router as transactionsRouter };