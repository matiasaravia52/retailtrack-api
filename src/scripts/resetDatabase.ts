import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

async function resetDatabase() {
  try {
    console.log('Iniciando reset de la base de datos...');
    
    // Paso 1: Sincronizar la base de datos (eliminar y recrear tablas)
    console.log('Paso 1: Sincronizando la base de datos...');
    await execPromise('npx ts-node src/scripts/syncDatabase.ts');
    
    // Paso 2: Cargar datos de ejemplo
    console.log('Paso 2: Cargando datos de ejemplo...');
    await execPromise('npx ts-node src/scripts/seedDatabase.ts');
    
    // Paso 3: Agregar restricciones UNIQUE
    console.log('Paso 3: Agregando restricciones UNIQUE...');
    await execPromise('npx ts-node src/scripts/addUniqueConstraints.ts');
    
    console.log('¡Reset de base de datos completado con éxito!');
    process.exit(0);
  } catch (error) {
    console.error('Error durante el reset de la base de datos:', error);
    process.exit(1);
  }
}

resetDatabase();
