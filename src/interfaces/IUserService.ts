import User from '../models/User';

/**
 * Interfaz para el servicio de usuarios
 * Define los métodos que debe implementar cualquier servicio de usuarios
 */
export interface IUserService {
  /**
   * Obtiene todos los usuarios
   */
  getAllUsers(): Promise<User[]>;
  
  /**
   * Obtiene un usuario por su ID
   * @param id ID del usuario
   */
  getUserById(id: string): Promise<User | null>;
  
  /**
   * Crea un nuevo usuario
   * @param userData Datos del usuario a crear
   */
  createUser(userData: {
    name: string;
    email: string;
    password: string;
    role?: 'admin' | 'manager' | 'employee';
  }): Promise<User>;
  
  /**
   * Actualiza un usuario existente
   * @param id ID del usuario a actualizar
   * @param userData Datos del usuario a actualizar
   */
  updateUser(id: string, userData: {
    name?: string;
    email?: string;
    password?: string;
    role?: 'admin' | 'manager' | 'employee';
  }): Promise<User | null>;
  
  /**
   * Elimina un usuario
   * @param id ID del usuario a eliminar
   */
  deleteUser(id: string): Promise<boolean>;
  
  /**
   * Busca usuarios por nombre o email
   * @param query Término de búsqueda
   */
  searchUsers(query: string): Promise<User[]>;
  
  /**
   * Actualiza la fecha de último login de un usuario
   * @param id ID del usuario
   */
  updateLastLogin(id: string): Promise<boolean>;
}
