import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import studentRoutes from './routes/students';
import batchRoutes from './routes/batches';
import financeRoutes from './routes/finances';
import sessionRoutes from './routes/sessions';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/finances', financeRoutes);
app.use('/api/sessions', sessionRoutes);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
