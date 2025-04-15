import { Op } from 'sequelize';
import User from '../models/User';
import { IUserRepository } from '../interfaces/IUserRepository';

/**
 * Implementación del repositorio de usuarios usando Sequelize
 */
export class UserRepository implements IUserRepository {
  /**
   * Encuentra todos los usuarios
   * @returns Lista de usuarios
   */
  async findAll(): Promise<User[]> {
    return User.findAll({
      attributes: { exclude: ['password'] }
    });
  }

  /**
   * Encuentra un usuario por su ID
   * @param id ID del usuario
   * @returns Usuario encontrado o null
   */
  async findById(id: string): Promise<User | null> {
    return User.findByPk(id);
  }

  /**
   * Encuentra un usuario por su email
   * @param email Email del usuario
   * @returns Usuario encontrado o null
   */
  async findByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email } });
  }

  /**
   * Crea un nuevo usuario
   * @param userData Datos del usuario a crear
   * @returns Usuario creado
   */
  async create(userData: {
    name: string;
    email: string;
    password: string;
    role?: 'admin' | 'manager' | 'employee';
  }): Promise<User> {
    return User.create({
      ...userData,
      role: userData.role || 'employee',
      lastLogin: null
    });
  }

  /**
   * Actualiza un usuario existente
   * @param user Usuario a actualizar
   * @param userData Datos a actualizar
   * @returns Usuario actualizado
   */
  async update(user: User, userData: {
    name?: string;
    email?: string;
    password?: string;
    role?: 'admin' | 'manager' | 'employee';
  }): Promise<User> {
    await user.update(userData);
    return user;
  }

  /**
   * Elimina un usuario
   * @param user Usuario a eliminar
   * @returns true si se eliminó correctamente
   */
  async delete(user: User): Promise<boolean> {
    await user.destroy();
    return true;
  }

  /**
   * Busca usuarios por nombre o email
   * @param query Término de búsqueda
   * @returns Lista de usuarios que coinciden con la búsqueda
   */
  async search(query: string): Promise<User[]> {
    return User.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { email: { [Op.iLike]: `%${query}%` } }
        ]
      },
      attributes: { exclude: ['password'] }
    });
  }

  /**
   * Actualiza la fecha de último login de un usuario
   * @param user Usuario a actualizar
   * @returns true si se actualizó correctamente
   */
  async updateLastLogin(user: User): Promise<boolean> {
    await user.update({ lastLogin: new Date() });
    return true;
  }
}
