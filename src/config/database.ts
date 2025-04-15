import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { getDatabaseUrl } from '../utils/railwayConfig';

dotenv.config();

// Determinar si estamos en producción
const isProduction = process.env.NODE_ENV === 'production';

// Obtener la URL de la base de datos optimizada para Railway
const dbUrl = getDatabaseUrl();
console.log(`Conectando a la base de datos en: ${isProduction ? 'entorno de producción' : 'entorno local'}`);

// Configuración de Sequelize
export const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  logging: isProduction ? false : console.log,
  dialectOptions: {
    ssl: isProduction ? {
      require: true,
      rejectUnauthorized: false // Necesario para Railway
    } : false
  },
  pool: {
    max: 5, // máximo de conexiones en el pool
    min: 0, // mínimo de conexiones en el pool
    acquire: 30000, // tiempo máximo en ms para obtener una conexión antes de lanzar error
    idle: 10000 // tiempo máximo en ms que una conexión puede estar inactiva antes de ser liberada
  }
});

const connectDB = async (): Promise<void> => {
  try {
    console.log('Intentando conectar a PostgreSQL...');
    await sequelize.authenticate();
    console.log('PostgreSQL Connected Successfully!');
    
    // Sincronizar modelos con la base de datos
    console.log('Sincronizando modelos con la base de datos...');
    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados con la base de datos correctamente');
  } catch (error: unknown) {
    // Manejar el error correctamente para TypeScript
    if (error instanceof Error) {
      console.error(`Error de conexión a la base de datos: ${error.message}`);
      console.error('Detalles adicionales:', error);
    } else {
      console.error('Error desconocido al conectar a la base de datos');
    }
    
    // En producción, es mejor no terminar el proceso inmediatamente
    if (!isProduction) {
      process.exit(1);
    }
  }
};

export { connectDB };
