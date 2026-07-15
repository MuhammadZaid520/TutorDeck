import { Response } from 'express';
import prisma from '../db';
import { AuthRequest } from '../middlewares/auth';

export const getBatches = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const batches = await prisma.batch.findMany({
      where: { userId: req.user?.id },
      include: {
        _count: {
          select: { students: true }
        }
      }
    });
    res.json(batches);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createBatch = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, subject, schedule } = req.body;
    const batch = await prisma.batch.create({
      data: {
        name, subject, schedule,
        userId: req.user!.id
      },
    });
    res.status(201).json(batch);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateBatch = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    const existing = await prisma.batch.findUnique({ where: { id } });
    if (!existing || existing.userId !== req.user?.id) {
      res.status(404).json({ message: 'Batch not found' });
      return;
    }

    const batch = await prisma.batch.update({
      where: { id },
      data,
    });
    res.json(batch);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteBatch = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const existing = await prisma.batch.findUnique({ where: { id } });
    if (!existing || existing.userId !== req.user?.id) {
      res.status(404).json({ message: 'Batch not found' });
      return;
    }

    await prisma.batch.delete({ where: { id } });
    res.json({ message: 'Batch deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
