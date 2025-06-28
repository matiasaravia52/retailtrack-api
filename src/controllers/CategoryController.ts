import { Request, Response } from 'express';
import { ICategoryService } from '../interfaces/service/ICategoryService';
import { CategoryService } from '../services/CategoryService';
import { CategoryRepository } from '../repositories/CategoryRepository';

export class CategoryController {
    private categoryService: ICategoryService;

    constructor() {
        const categoryRepository = new CategoryRepository();
        this.categoryService = new CategoryService(categoryRepository);
    }

    getAllCategories = async (req: Request, res: Response): Promise<void> => {
        try {
            const categories = await this.categoryService.getAllCategories();
            res.status(200).json(categories);
        } catch (error) {
            console.error('Error al obtener categorías:', error);
            res.status(500).json({ message: 'Error al obtener categorías' });
        }
    };

    getCategoryById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const category = await this.categoryService.getCategoryById(id);
            
            if (!category) {
                res.status(404).json({ message: 'Categoría no encontrada' });
                return;
            }
            
            res.status(200).json(category);
        } catch (error) {
            console.error('Error al obtener categoría:', error);
            res.status(500).json({ message: 'Error al obtener categoría' });
        }
    };

    createCategory = async (req: Request, res: Response): Promise<void> => {
        try {
            const categoryData = req.body;
            const newCategory = await this.categoryService.createCategory(categoryData);
            res.status(201).json(newCategory);
        } catch (error) {
            console.error('Error al crear categoría:', error);
            res.status(500).json({ message: 'Error al crear categoría' });
        }
    };

    updateCategory = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const categoryData = req.body;
            const updatedCategory = await this.categoryService.updateCategory(id, categoryData);
            res.status(200).json(updatedCategory);
        } catch (error) {
            console.error('Error al actualizar categoría:', error);
            res.status(500).json({ message: 'Error al actualizar categoría' });
        }
    };

    deleteCategory = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            await this.categoryService.deleteCategory(id);
            res.status(204).send();
        } catch (error) {
            console.error('Error al eliminar categoría:', error);
            res.status(500).json({ message: 'Error al eliminar categoría' });
        }
    };

    searchCategories = async (req: Request, res: Response): Promise<void> => {
        try {
            const { query } = req.query;
            
            if (!query || typeof query !== 'string') {
                res.status(400).json({ message: 'Se requiere un parámetro de búsqueda' });
                return;
            }
            
            const categories = await this.categoryService.searchCategories(query);
            res.status(200).json(categories);
        } catch (error) {
            console.error('Error al buscar categorías:', error);
            res.status(500).json({ message: 'Error al buscar categorías' });
        }
    };
}
