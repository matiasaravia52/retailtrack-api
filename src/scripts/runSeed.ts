import { sequelize } from '../config/database';
import { seedRolesAndPermissions } from '../utils/seedRolesAndPermissions';

/**
 * Script para ejecutar las semillas de la base de datos
 */
async function runSeed() {
  try {
    // Asegurarse de que la conexión a la base de datos está establecida
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
    
    // Ejecutar las semillas de roles y permisos
    await seedRolesAndPermissions();
    
    console.log('Semillas ejecutadas correctamente.');
    process.exit(0);
  } catch (error) {
    console.error('Error al ejecutar las semillas:', error);
    process.exit(1);
  }
}

// Ejecutar el script
runSeed();
