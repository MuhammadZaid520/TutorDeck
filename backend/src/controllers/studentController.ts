import { Response } from 'express';
import prisma from '../db';
import { AuthRequest } from '../middlewares/auth';

export const getStudents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const students = await prisma.student.findMany({
      where: { userId: req.user!.id },
      include: { batch: true },
    });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createStudent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, phone, grade, parentName, parentPhone, batchId } = req.body;
    const student = await prisma.student.create({
      data: {
        name, email, phone, grade, parentName, parentPhone, batchId,
        userId: req.user!.id
      },
      include: { batch: true },
    });
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateStudent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const data = req.body;
    
    // Ensure student belongs to user
    const existing = await prisma.student.findUnique({ where: { id } });
    if (!existing || existing.userId !== req.user?.id) {
      res.status(404).json({ message: 'Student not found' });
      return;
    }

    const student = await prisma.student.update({
      where: { id },
      data,
      include: { batch: true },
    });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteStudent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    
    const existing = await prisma.student.findUnique({ where: { id } });
    if (!existing || existing.userId !== req.user?.id) {
      res.status(404).json({ message: 'Student not found' });
      return;
    }

    await prisma.student.delete({ where: { id } });
    res.json({ message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
