import { Response } from 'express';
import prisma from '../db';
import { AuthRequest } from '../middlewares/auth';

export const getSessions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sessions = await prisma.session.findMany({
      where: { userId: req.user!.id },
      include: {
        batch: true,
        students: true,
      },
      orderBy: { date: 'asc' },
    });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, date, duration, type, status, batchId } = req.body;
    const session = await prisma.session.create({
      data: {
        title,
        date: new Date(date),
        duration: Number(duration),
        type,
        status,
        batchId,
        userId: req.user!.id
      },
    });
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const data = req.body;
    if (data.date) data.date = new Date(data.date);
    if (data.duration) data.duration = Number(data.duration);
    
    const existing = await prisma.session.findUnique({ where: { id } });
    if (!existing || existing.userId !== req.user?.id) {
      res.status(404).json({ message: 'Session not found' });
      return;
    }

    const session = await prisma.session.update({
      where: { id },
      data,
    });
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    
    const existing = await prisma.session.findUnique({ where: { id } });
    if (!existing || existing.userId !== req.user?.id) {
      res.status(404).json({ message: 'Session not found' });
      return;
    }

    await prisma.session.delete({ where: { id } });
    res.json({ message: 'Session deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
