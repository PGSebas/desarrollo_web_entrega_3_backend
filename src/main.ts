import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './interface/routes/auth.routes';
import perfumeRoutes from './interface/routes/perfume.routes';
import pedidoRoutes from './interface/routes/pedido.routes';
import { errorHandler } from './interface/middlewares/error.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const allowedOrigins = [
  FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:3001',
  'https://desarrollo-web-entrega-3-frontend.vercel.app',
  'https://proyecto-semestral.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Bloqueado por política CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'Noiré Perfumes API REST',
    version: '1.0.0',
    description: 'API REST oficial de Noiré Haute Parfumerie (Entrega 3 · Desarrollo Web 2026-2)',
    endpoints: {
      health: '/api/health',
      perfumes: '/api/perfumes',
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
        profile: 'GET /api/auth/me',
      },
      pedidos: {
        create: 'POST /api/pedidos',
        mias: 'GET /api/pedidos/mias',
        all: 'GET /api/pedidos (admin)',
      },
    },
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'Noiré Perfumes API REST',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/perfumes', perfumeRoutes);
app.use('/api/pedidos', pedidoRoutes);

app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    statusCode: 404,
    message: `Ruta ${req.method} ${req.originalUrl} no encontrada en la API.`,
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`⚡ Servidor de Noiré Perfumes ejecutándose en http://localhost:${PORT}`);
});
