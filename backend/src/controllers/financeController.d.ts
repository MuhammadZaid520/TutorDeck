import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
export declare const getTransactions: (req: AuthRequest, res: Response) => Promise<void>;
export declare const createTransaction: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteTransaction: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=financeController.d.ts.map