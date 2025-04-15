import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import pingRouter from './routes/ping';
import userRoutes from './routes/users';
import { connectDB, sequelize } from './config/database';
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

// Rutas
app.use(pingRouter);
app.use('/api', userRoutes);

// Importar modelos para asegurarnos de que están registrados
import './models/User';

// Conectar a la base de datos y sincronizar modelos al iniciar la aplicación
connectDB()
  .then(async () => {
    try {
      // Sincronizar modelos con la base de datos
      // { alter: true } actualiza las tablas existentes si hay cambios en los modelos
      await sequelize.sync({ alter: true });
      console.log('Modelos sincronizados con la base de datos');
    } catch (error) {
      console.error('Error al sincronizar modelos:', error);
    }
  })
  .catch(err => {
    console.error('Error al conectar con la base de datos al iniciar:', err);
    // No terminamos el proceso para permitir que la aplicación siga funcionando
    // y pueda intentar reconectarse más tarde
  });

export default app;
