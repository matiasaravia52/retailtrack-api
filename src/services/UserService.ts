import { IUserService } from '../interfaces/service/IUserService';
import { IUserRepository } from '../interfaces/repository/IUserRepository';
import User from '../models/User';
import { CreateUserDto, UpdateUserDto } from '../dto/UserDto';

/**
 * Implementación del servicio de usuarios
 */
export class UserService implements IUserService {
  private userRepository: IUserRepository;
  
  /**
   * Constructor del servicio de usuarios
   * @param userRepository Repositorio de usuarios a utilizar
   */
  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }
  
  /**
   * Obtiene todos los usuarios
   * @returns Lista de usuarios
   */
  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }
  
  /**
   * Obtiene un usuario por su ID
   * @param id ID del usuario
   * @returns Usuario encontrado o null
   */
  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }
  
  /**
   * Crea un nuevo usuario
   * @param userData Datos del usuario a crear
   * @returns Usuario creado
   * @throws Error si el email ya está registrado
   */
  async createUser(userData: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }
    
    // Crear el usuario
    const user = await this.userRepository.create(userData);
    
    // Devolver el usuario sin la contraseña
    const userJson = user.toJSON();
    const { password: _, ...userWithoutPassword } = userJson;
    
    return userWithoutPassword as User;
  }
  
  /**
   * Actualiza un usuario existente
   * @param id ID del usuario a actualizar
   * @param userData Datos del usuario a actualizar
   * @returns Usuario actualizado o null si no se encuentra
   * @throws Error si el email ya está registrado por otro usuario
   */
  async updateUser(id: string, userData: UpdateUserDto): Promise<User | null> {
    // Buscar el usuario
    const user = await this.userRepository.findById(id);
    if (!user) {
      return null;
    }
    
    if (userData.email && userData.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser) {
        throw new Error('Email already registered');
      }
    }
    
    // Actualizar el usuario
    const updatedUser = await this.userRepository.update(user, userData);
    
    // Devolver el usuario sin la contraseña
    const userJson = updatedUser.toJSON();
    const { password: _, ...userWithoutPassword } = userJson;
    
    return userWithoutPassword as User;
  }
  
  /**
   * Elimina un usuario
   * @param id ID del usuario a eliminar
   * @returns true si se eliminó correctamente, false si no se encuentra
   */
  async deleteUser(id: string): Promise<boolean> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      return false;
    }
    
    return this.userRepository.delete(user);
  }
  
  /**
   * Busca usuarios por nombre o email
   * @param query Término de búsqueda
   * @returns Lista de usuarios que coinciden con la búsqueda
   */
  async searchUsers(query: string): Promise<User[]> {
    return this.userRepository.search(query);
  }
  
  /**
   * Actualiza la fecha de último login de un usuario
   * @param id ID del usuario
   * @returns true si se actualizó correctamente, false si no se encuentra
   */
  async updateLastLogin(id: string): Promise<boolean> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      return false;
    }
    
    return this.userRepository.updateLastLogin(user);
  }
}
