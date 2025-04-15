import app from './src/app';

// Este archivo es el punto de entrada para producción
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
