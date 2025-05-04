import { sequelize } from '../config/database';
import { User, Role, UserRole } from '../models';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

async function createTestUser() {
  const transaction = await sequelize.transaction();
  
  try {
    console.log('Creando usuario de prueba...');
    
    // Generar hash de la contraseña
    const password = 'test123';
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Crear usuario
    const testUser = await User.create({
      id: uuidv4(),
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      role: 'admin',
      lastLogin: null
    }, { transaction });
    
    // Buscar el rol de administrador
    const adminRole = await Role.findOne({
      where: { name: 'Administrador' }
    });
    
    if (adminRole) {
      // Asignar rol de administrador al usuario
      await UserRole.create({
        userId: testUser.id,
        roleId: adminRole.id
      }, { transaction });
    } else {
      console.log('No se encontró el rol de administrador');
    }
    
    await transaction.commit();
    console.log('Usuario de prueba creado con éxito:');
    console.log(`Email: test@example.com`);
    console.log(`Password: ${password}`);
    process.exit(0);
  } catch (error) {
    await transaction.rollback();
    console.error('Error al crear usuario de prueba:', error);
    process.exit(1);
  }
}

createTestUser();
