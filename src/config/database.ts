import { Sequelize, Options as SequelizeOptions } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const environment = isProduction ? 'Production' : 'Development';

const databaseUrl = process.env.DATABASE_URL;
const defaultUrl = 'postgres://postgres:postgres@localhost:5432/retailtrack-api';
const connectionUrl = databaseUrl || defaultUrl;

const sequelizeOptions: SequelizeOptions = {
  dialect: 'postgres',
  logging: isProduction ? false : console.log,
  dialectOptions: {
    ssl: isProduction ? {
      require: true,
      rejectUnauthorized: false
    } : false
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

export const sequelize = new Sequelize(connectionUrl, sequelizeOptions);

export const syncOptions = isProduction 
  ? { force: false } 
  : { alter: true };

export const connectDB = async (): Promise<void> => {
  try {
    console.log(`Environment: ${environment}`);
    console.log(`DATABASE_URL available: ${databaseUrl ? 'Yes' : 'No'}`);
    
    if (!databaseUrl && isProduction) {
      console.warn('WARNING: DATABASE_URL not found in production environment');
    }
    
    console.log('Attempting to connect to PostgreSQL...');
    await sequelize.authenticate();
    console.log('PostgreSQL Connected Successfully!');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Database connection error: ${error.message}`);
      console.error('Additional details:', error);
    } else {
      console.error('Unknown error connecting to database');
    }
    
    if (!isProduction) {
      process.exit(1);
    }
  }
};

export { isProduction, environment };

