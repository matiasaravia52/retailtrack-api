import { sequelize } from '../config/database';
import { seedRolesAndPermissions } from '../utils/seedRolesAndPermissions';
import { User, Role, UserRole } from '../models';
import { v4 as uuidv4 } from 'uuid';

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
    console.log('Semillas de roles y permisos ejecutadas correctamente.');
    
    // Crear usuario administrador
    await createAdminUser();
    console.log('Usuario administrador creado correctamente.');
    
    console.log('Todas las semillas ejecutadas correctamente.');
    process.exit(0);
  } catch (error) {
    console.error('Error al ejecutar las semillas:', error);
    process.exit(1);
  }
}

/**
 * Función para crear el usuario administrador
 */
async function createAdminUser() {
  try {
    // Verificar si ya existe un usuario admin
    const existingAdmin = await User.findOne({ where: { email: 'admin@example.com' } });
    
    // Buscar el rol de administrador (usando el nombre 'admin' que es el que se crea en seedRolesAndPermissions)
    const adminRole = await Role.findOne({ where: { name: 'admin' } });
    
    if (!adminRole) {
      throw new Error('No se encontró el rol de administrador. Asegúrate de que se ejecutó seedRolesAndPermissions primero.');
    }
    
    if (existingAdmin) {
      console.log('El usuario admin ya existe. Email: admin@example.com');
      // Opcional: Actualizar la contraseña
      existingAdmin.password = 'password'; // El hook beforeUpdate se encargará de encriptarla
      await existingAdmin.save();
      
      // Verificar si ya tiene el rol de admin
      const hasAdminRole = await UserRole.findOne({
        where: { userId: existingAdmin.id, roleId: adminRole.id }
      });
      
      if (!hasAdminRole) {
        // Asignar el rol de administrador
        await UserRole.create({
          userId: existingAdmin.id,
          roleId: adminRole.id
        });
        console.log('Rol de administrador asignado al usuario existente');
      }
      
      console.log('Contraseña actualizada a: "password"');
    } else {
      // Crear el usuario admin
      const adminUser = await User.create({
        id: uuidv4(),
        name: 'Admin',
        email: 'admin@example.com',
        password: 'password', // El hook beforeCreate se encargará de encriptarla
        role: 'admin',
        lastLogin: null
      });
      
      // Asignar el rol de administrador
      await UserRole.create({
        userId: adminUser.id,
        roleId: adminRole.id
      });
      
      console.log('Usuario admin creado con éxito:');
      console.log('Email: admin@example.com');
      console.log('Contraseña: password');
    }
    
    return true;
  } catch (error) {
    console.error('Error al crear el usuario administrador:', error);
    throw error;
  }
}

// Ejecutar el script
runSeed();
