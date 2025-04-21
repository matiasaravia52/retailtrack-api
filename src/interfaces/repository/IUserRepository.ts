import User from '../../models/User';

/**
 * Interfaz para el repositorio de usuarios
 * Define los métodos que debe implementar cualquier repositorio de usuarios
 */
export interface IUserRepository {
  /**
   * Encuentra todos los usuarios
   */
  findAll(): Promise<User[]>;
  
  /**
   * Encuentra un usuario por su ID
   * @param id ID del usuario
   */
  findById(id: string): Promise<User | null>;
  
  /**
   * Encuentra un usuario por su email
   * @param email Email del usuario
   */
  findByEmail(email: string): Promise<User | null>;
  
  /**
   * Crea un nuevo usuario
   * @param userData Datos del usuario a crear
   */
  create(userData: {
    name: string;
    email: string;
    password: string;
    role?: 'admin' | 'manager' | 'employee';
  }): Promise<User>;
  
  /**
   * Actualiza un usuario existente
   * @param user Usuario a actualizar
   * @param userData Datos a actualizar
   */
  update(user: User, userData: {
    name?: string;
    email?: string;
    password?: string;
    role?: 'admin' | 'manager' | 'employee';
  }): Promise<User>;
  
  /**
   * Elimina un usuario
   * @param user Usuario a eliminar
   */
  delete(user: User): Promise<boolean>;
  
  /**
   * Busca usuarios por nombre o email
   * @param query Término de búsqueda
   */
  search(query: string): Promise<User[]>;
  
  /**
   * Actualiza la fecha de último login de un usuario
   * @param user Usuario a actualizar
   */
  updateLastLogin(user: User): Promise<boolean>;
}
