import app from './src/app';

// Este archivo es el punto de entrada para producción
const PORT = process.env.PORT || 3000;

// Imprimir variables de entorno importantes (sin mostrar credenciales)
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'no definido'}`); 
console.log(`DATABASE_URL disponible: ${process.env.DATABASE_URL ? 'Sí' : 'No'}`); 

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
