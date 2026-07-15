import { Router } from 'express';
import { getSessions, createSession, updateSession, deleteSession } from '../controllers/sessionController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

router.get('/', getSessions);
router.post('/', createSession);
router.put('/:id', updateSession);
router.delete('/:id', deleteSession);

export default router;
