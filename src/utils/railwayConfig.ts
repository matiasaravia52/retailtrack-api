// Utilidad para configurar variables de entorno específicas para Railway

/**
 * Configura las variables de entorno específicas para Railway
 * Esta función debe ser llamada al inicio de la aplicación
 */
export const configureRailwayEnvironment = (): void => {
  // Verificar si estamos en Railway
  const isRailway = !!process.env.RAILWAY_STATIC_URL;
  
  if (isRailway) {
    console.log('Entorno de Railway detectado');
    
    // Configurar NODE_ENV como producción si no está definido
    if (!process.env.NODE_ENV) {
      process.env.NODE_ENV = 'production';
      console.log('NODE_ENV configurado como "production"');
    }
    
    // Verificar la configuración de la base de datos
    if (process.env.DATABASE_URL) {
      console.log('Variable DATABASE_URL encontrada');
      
      // Extraer información de la URL de la base de datos (sin mostrar credenciales)
      try {
        const dbUrl = new URL(process.env.DATABASE_URL);
        console.log(`Host de la base de datos: ${dbUrl.hostname}`);
        console.log(`Puerto de la base de datos: ${dbUrl.port}`);
        console.log(`Nombre de la base de datos: ${dbUrl.pathname.substring(1)}`);
      } catch (error) {
        console.error('Error al parsear DATABASE_URL:', error);
      }
    } else {
      console.warn('⚠️ No se encontró la variable DATABASE_URL en Railway');
    }
    
    // Verificar otras variables de entorno importantes
    console.log(`PORT configurado: ${process.env.PORT || '3000 (valor por defecto)'}`);
  }
};

/**
 * Obtiene la URL de la base de datos para Railway
 * Esta función maneja la lógica específica para asegurarse de que la URL sea correcta
 */
export const getDatabaseUrl = (): string => {
  const defaultUrl = 'postgres://postgres:postgres@localhost:5432/retailtrack-api';
  
  // Si estamos en Railway, asegurarnos de que la URL de la base de datos sea correcta
  if (process.env.RAILWAY_STATIC_URL && process.env.DATABASE_URL) {
    // En Railway, asegurarnos de que no estamos usando localhost o 127.0.0.1
    const dbUrl = process.env.DATABASE_URL;
    
    if (dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1') || dbUrl.includes('::1')) {
      console.warn('⚠️ DATABASE_URL contiene una referencia a localhost. Esto no funcionará en Railway.');
      
      // Si hay una variable PGHOST, intentar construir una URL alternativa
      if (process.env.PGHOST && process.env.PGUSER && process.env.PGPASSWORD && process.env.PGDATABASE) {
        const alternativeUrl = `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT || '5432'}/${process.env.PGDATABASE}`;
        console.log('Usando URL alternativa para la base de datos');
        return alternativeUrl;
      }
    }
    
    return dbUrl;
  }
  
  return process.env.DATABASE_URL || defaultUrl;
};
