import { sequelize } from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

async function createUserDirectly() {
  try {
    console.log('Creando usuario directamente en la base de datos...');
    
    // Generar hash de la contraseña
    const password = 'admin123';
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Crear usuario directamente con SQL
    const userId = uuidv4();
    const now = new Date();
    
    await sequelize.query(`
      INSERT INTO users (id, name, email, password, role, "lastLogin", "createdAt", "updatedAt")
      VALUES (:id, :name, :email, :password, :role, :lastLogin, :createdAt, :updatedAt)
    `, {
      replacements: {
        id: userId,
        name: 'Admin Direct',
        email: 'admin.direct@example.com',
        password: hashedPassword,
        role: 'admin',
        lastLogin: null,
        createdAt: now,
        updatedAt: now
      }
    });
    
    // Buscar el rol de administrador
    const [adminRoles] = await sequelize.query(`
      SELECT id FROM roles WHERE name = 'Administrador'
    `) as [any[], any];
    
    if (adminRoles && adminRoles.length > 0) {
      const adminRoleId = adminRoles[0].id;
      
      // Asignar rol de administrador al usuario
      await sequelize.query(`
        INSERT INTO user_roles (user_id, role_id, "createdAt", "updatedAt")
        VALUES (:userId, :roleId, :createdAt, :updatedAt)
      `, {
        replacements: {
          userId: userId,
          roleId: adminRoleId,
          createdAt: now,
          updatedAt: now
        }
      });
      
      console.log('Rol de administrador asignado correctamente');
    } else {
      console.log('No se encontró el rol de administrador');
    }
    
    console.log('Usuario creado directamente en la base de datos:');
    console.log(`Email: admin.direct@example.com`);
    console.log(`Password: ${password}`);
    process.exit(0);
  } catch (error) {
    console.error('Error al crear usuario directamente:', error);
    process.exit(1);
  }
}

createUserDirectly();
