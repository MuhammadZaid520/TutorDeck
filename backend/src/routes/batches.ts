import { Router } from 'express';
import { getBatches, createBatch, updateBatch, deleteBatch } from '../controllers/batchController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

router.get('/', getBatches);
router.post('/', createBatch);
router.put('/:id', updateBatch);
router.delete('/:id', deleteBatch);

export default router;
