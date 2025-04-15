import { Request, Response } from 'express';
import User from '../models/User';
import { Op } from 'sequelize';

// Obtener todos los usuarios
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] } // Excluir el campo de contraseña
    });
    res.json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios', error });
  }
};

// Obtener un usuario por ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error(`Error al obtener usuario con ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error al obtener usuario', error });
  }
};

// Crear un nuevo usuario
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    // Validar datos requeridos
    if (!name || !email || !password) {
      res.status(400).json({ message: 'Nombre, email y contraseña son requeridos' });
      return;
    }

    // Verificar si el email ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: 'El email ya está registrado' });
      return;
    }

    // Crear el usuario
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'employee', // Valor por defecto si no se proporciona
      lastLogin: null
    });

    // Responder con el usuario creado (sin la contraseña)
    const userResponse = user.toJSON();
    const { password: _, ...userWithoutPassword } = userResponse;
    
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ message: 'Error al crear usuario', error });
  }
};

// Actualizar un usuario
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, role, password } = req.body;

    // Buscar el usuario
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    // Actualizar los campos proporcionados
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (password) user.password = password;

    // Guardar los cambios
    await user.save();

    // Responder con el usuario actualizado (sin la contraseña)
    const userResponse = user.toJSON();
    const { password: _, ...userWithoutPassword } = userResponse;
    
    res.json(userWithoutPassword);
  } catch (error) {
    console.error(`Error al actualizar usuario con ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error al actualizar usuario', error });
  }
};

// Eliminar un usuario
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Buscar el usuario
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    // Eliminar el usuario
    await user.destroy();
    
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error(`Error al eliminar usuario con ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error al eliminar usuario', error });
  }
};

// Buscar usuarios
export const searchUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.query;
    
    if (!query) {
      res.status(400).json({ message: 'Se requiere un término de búsqueda' });
      return;
    }

    const users = await User.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { email: { [Op.iLike]: `%${query}%` } }
        ]
      },
      attributes: { exclude: ['password'] }
    });

    res.json(users);
  } catch (error) {
    console.error('Error al buscar usuarios:', error);
    res.status(500).json({ message: 'Error al buscar usuarios', error });
  }
};

// Actualizar la fecha de último login
export const updateLastLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Buscar el usuario
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    // Actualizar la fecha de último login
    user.lastLogin = new Date();
    await user.save();

    res.json({ message: 'Fecha de último login actualizada correctamente' });
  } catch (error) {
    console.error(`Error al actualizar último login del usuario con ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error al actualizar último login', error });
  }
};
