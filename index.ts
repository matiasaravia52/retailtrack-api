import app from './src/app';
import { configureRailwayEnvironment } from './src/utils/railwayConfig';

// Configurar el entorno de Railway si es necesario
configureRailwayEnvironment();

// Este archivo es el punto de entrada para producción
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
