import { sequelize, connectDB } from '../config/database';

// Función para probar la conexión a la base de datos
const testDatabaseConnection = async (): Promise<void> => {
  try {
    console.log('Iniciando prueba de conexión a la base de datos...');
    console.log(`NODE_ENV: ${process.env.NODE_ENV || 'no definido'}`);
    console.log(`DATABASE_URL disponible: ${process.env.DATABASE_URL ? 'Sí' : 'No'}`);
    
    // Intentar conectar
    await connectDB();
    
    // Verificar que podemos ejecutar consultas básicas
    const result = await sequelize.query('SELECT NOW() as current_time');
    console.log('Consulta de prueba exitosa:', result[0]);
    
    console.log('Conexión a la base de datos establecida correctamente');
  } catch (error) {
    console.error('Error al probar la conexión a la base de datos:');
    console.error(error);
  } finally {
    // No cerramos la conexión aquí para permitir que la aplicación siga usando la conexión
  }
};

export { testDatabaseConnection };
