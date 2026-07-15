import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
export declare const getSessions: (req: AuthRequest, res: Response) => Promise<void>;
export declare const createSession: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateSession: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteSession: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=sessionController.d.ts.map