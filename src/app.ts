import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import pingRouter from './routes/ping';
import userRoutes from './routes/users';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import roleRoutes from './routes/roleRoutes';
import permissionRoutes from './routes/permissionRoutes';
import userRoleRoutes from './routes/userRoleRoutes';
import { connectDB, sequelize, syncOptions } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { seedRolesAndPermissions } from './utils/seedRolesAndPermissions';

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


app.use(pingRouter);
app.use('/api', userRoutes);
app.use('/api', authRoutes);
app.use('/api', productRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/users', userRoleRoutes);


connectDB()
  .then(async () => {
    try {
      console.log(`Syncing models with options: ${JSON.stringify(syncOptions)}`);
      await sequelize.sync(syncOptions);
      console.log('Models synced with database successfully');
      
      // Inicializar roles y permisos predeterminados
      await seedRolesAndPermissions();
      console.log('Roles y permisos inicializados correctamente');
    } catch (error) {
      console.error('Error syncing models or seeding data:', error);
    }
  })
  .catch(err => {
    console.error('Error connecting to database on startup:', err);
  });

// Registrar el middleware de manejo de errores (debe ser el último middleware)
app.use(errorHandler);

export default app;
