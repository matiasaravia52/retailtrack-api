import { User, Role, UserRole } from '../models';
import bcrypt from 'bcrypt';
import { connectDB, sequelize } from '../config/database';

/**
 * Script para crear un usuario administrador con todos los permisos
 * @param name Nombre del usuario
 * @param email Email del usuario
 * @param password Contraseña del usuario
 */
export async function createAdminUser(name: string, email: string, password: string): Promise<void> {
  try {
    console.log(`Creando usuario administrador: ${name} (${email})...`);
    
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log(`El usuario con email ${email} ya existe. Actualizando a administrador...`);
      
      // Buscar el rol de administrador
      const adminRole = await Role.findOne({ where: { name: 'admin' } });
      if (!adminRole) {
        throw new Error('No se encontró el rol de administrador. Ejecuta primero seedRolesAndPermissions()');
      }
      
      // Verificar si ya tiene el rol de administrador
      const existingUserRole = await UserRole.findOne({
        where: { userId: existingUser.id, roleId: adminRole.id }
      });
      
      if (existingUserRole) {
        console.log(`El usuario ${email} ya tiene el rol de administrador.`);
      } else {
        // Asignar rol de administrador
        await UserRole.create({
          userId: existingUser.id,
          roleId: adminRole.id
        });
        console.log(`Rol de administrador asignado al usuario ${email}.`);
      }
      
      return;
    }
    
    // Crear el usuario (el modelo se encargará de hashear la contraseña automáticamente)
    const user = await User.create({
      name,
      email,
      password, // La contraseña sin procesar, el hook del modelo la hasheará
      role: 'admin' // Mantener compatibilidad con el campo role existente
    });
    
    console.log(`Usuario creado con ID: ${user.id}`);
    
    // Buscar el rol de administrador
    const adminRole = await Role.findOne({ where: { name: 'admin' } });
    if (!adminRole) {
      throw new Error('No se encontró el rol de administrador. Ejecuta primero seedRolesAndPermissions()');
    }
    
    // Asignar rol de administrador
    await UserRole.create({
      userId: user.id,
      roleId: adminRole.id
    });
    
    console.log(`Usuario administrador creado exitosamente: ${name} (${email})`);
  } catch (error) {
    console.error('Error al crear usuario administrador:', error);
    throw error;
  }
}

// Si se ejecuta directamente desde la línea de comandos
if (require.main === module) {
  // Obtener argumentos de la línea de comandos
  const args = process.argv.slice(2);
  const name = args[0];
  const email = args[1];
  const password = args[2];
  
  if (!name || !email || !password) {
    console.error('Uso: ts-node createAdminUser.ts <nombre> <email> <contraseña>');
    process.exit(1);
  }
  
  // Conectar a la base de datos y crear el usuario
  connectDB()
    .then(async () => {
      try {
        await createAdminUser(name, email, password);
        process.exit(0);
      } catch (error) {
        console.error('Error:', error);
        process.exit(1);
      }
    })
    .catch(err => {
      console.error('Error connecting to database:', err);
      process.exit(1);
    });
}
