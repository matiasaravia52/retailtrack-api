import { sequelize } from '../config/database';
import { User, Role, UserRole } from '../models';
import { v4 as uuidv4 } from 'uuid';

async function createAdminUser() {
  try {
    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');

    // Verificar si ya existe un usuario admin
    const existingAdmin = await User.findOne({ where: { email: 'admin@example.com' } });
    
    if (existingAdmin) {
      console.log('El usuario admin ya existe. Email: admin@example.com');
      // Opcional: Actualizar la contraseña
      existingAdmin.password = 'password'; // El hook beforeUpdate se encargará de encriptarla
      await existingAdmin.save();
      console.log('Contraseña actualizada a: "password"');
    } else {
      // Buscar el rol de administrador
      let adminRole = await Role.findOne({ where: { name: 'Administrador' } });
      
      // Si no existe el rol, crearlo
      if (!adminRole) {
        adminRole = await Role.create({
          id: uuidv4(),
          name: 'Administrador',
          description: 'Acceso completo al sistema'
        });
        console.log('Rol de Administrador creado');
      }
      
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
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createAdminUser();
