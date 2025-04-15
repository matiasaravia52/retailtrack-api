FROM node:18-alpine

WORKDIR /app

# Instalar dependencias primero para aprovechar la caché de Docker
COPY package*.json ./
RUN npm ci

# Copiar el código fuente
COPY . .

# Crear el directorio dist si no existe
RUN mkdir -p dist

# Compilar la aplicación TypeScript
RUN npm run build

EXPOSE 3000

# Usar node directamente en lugar de npm para evitar problemas de señales
CMD ["node", "dist/index.js"]
