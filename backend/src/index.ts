import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;
const defaultCorsOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://169.254.83.107:3000',
  'https://absurtyemek.com',
  'https://www.absurtyemek.com',
  'https://absurtyemek.vercel.app',
];
const allowedOrigins = (process.env.CORS_ORIGINS || defaultCorsOrigins.join(','))
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      const isAllowedVercelPreview = Boolean(origin?.endsWith('.vercel.app'));

      if (!origin || allowedOrigins.includes(origin) || isAllowedVercelPreview) {
        callback(null, true);
        return;
      }

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Absurt Yemek API is running');
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ ok: true, service: 'absurtyemek-api' });
});

import recipeRoutes from './routes/recipes';
import adminRoutes from './routes/admin';

app.use('/api/recipes', recipeRoutes);
app.use('/api/admin', adminRoutes);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
