import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import pingRouter from './routes/ping';
import userRoutes from './routes/users';
import { connectDB, sequelize, syncOptions } from './config/database';
import { testDatabaseConnection } from './utils/dbTest';

dotenv.config();

// Crear la aplicación Express
const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());

// Ruta para verificar el estado de la API
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok',
    message: 'RetailTrack API está funcionando correctamente',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Ruta para probar la conexión a la base de datos
app.get('/db-test', async (req: Request, res: Response) => {
  try {
    await testDatabaseConnection();
    res.json({ 
      status: 'ok', 
      message: 'Conexión a la base de datos establecida correctamente' 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Error al conectar con la base de datos',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

app.use(pingRouter);
app.use('/api', userRoutes);

import './models/User';
import { errorHandler } from './middleware/errorHandler';

connectDB()
  .then(async () => {
    try {
      console.log(`Syncing models with options: ${JSON.stringify(syncOptions)}`);
      await sequelize.sync(syncOptions);
      console.log('Models synced with database successfully');
    } catch (error) {
      console.error('Error syncing models:', error);
    }
  })
  .catch(err => {
    console.error('Error connecting to database on startup:', err);
  });

// Registrar el middleware de manejo de errores (debe ser el último middleware)
app.use(errorHandler);

export default app;
