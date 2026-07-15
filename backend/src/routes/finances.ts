import { Router } from 'express';
import { getTransactions, createTransaction, deleteTransaction } from '../controllers/financeController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

router.get('/', getTransactions);
router.post('/', createTransaction);
router.delete('/:id', deleteTransaction);

export default router;
