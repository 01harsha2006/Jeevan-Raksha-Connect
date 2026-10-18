import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

import authRoutes from './routes/auth.js';
import requestRoutes from './routes/requests.js';
import driverRoutes from './routes/drivers.js';
import ambulanceRoutes from './routes/ambulances.js';
import hospitalRoutes from './routes/hospitals.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logger for development
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'Jeevan Raksha Connect Emergency Dispatch System',
    region: 'Vellangallur, Kerala, India',
    timestamp: new Date(),
  });
});

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/ambulances', ambulanceRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/admin', adminRoutes);

// 404 Route handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Resource not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start Server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚑 Jeevan Raksha Connect Backend Server Running`);
    console.log(`📍 Operating Region: Vellangallur, Kerala (680662)`);
    console.log(`🌐 Port: ${PORT}`);
    console.log(`🚨 Emergency Endpoint: http://localhost:${PORT}/api/health`);
    console.log(`====================================================`);
  });
};

startServer();
