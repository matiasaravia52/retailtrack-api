import { addUniqueConstraints } from '../config/database';

async function runAddUniqueConstraints() {
  try {
    console.log('Agregando restricciones UNIQUE a las tablas...');
    
    await addUniqueConstraints();
    
    console.log('¡Restricciones UNIQUE agregadas correctamente!');
    process.exit(0);
  } catch (error) {
    console.error('Error al agregar restricciones UNIQUE:', error);
    process.exit(1);
  }
}

runAddUniqueConstraints();
