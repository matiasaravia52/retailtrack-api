import { sequelize } from '../config/database';
import '../models'; // Importa todos los modelos para que se registren

async function syncDatabase() {
  try {
    console.log('Sincronizando la base de datos...');
    
    // Esto eliminará todas las tablas y las recreará
    await sequelize.sync({ force: true });
    
    console.log('¡Base de datos sincronizada correctamente!');
    process.exit(0);
  } catch (error) {
    console.error('Error al sincronizar la base de datos:', error);
    process.exit(1);
  }
}

syncDatabase();
