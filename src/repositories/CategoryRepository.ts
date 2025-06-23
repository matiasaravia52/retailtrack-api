import { Op } from 'sequelize';
import Category from '../models/Category';
import { ICategoryRepository } from '../interfaces/repository/ICategoryRepository';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/CategoryDto';

export class CategoryRepository implements ICategoryRepository {
    async findAll(): Promise<Category[]> {
        return await Category.findAll();
    }

    async findById(id: string): Promise<Category | null> {
        return await Category.findByPk(id);
    }

    async create(category: CreateCategoryDto): Promise<Category> {
        return await Category.create(category as any);
    }

    async update(id: string, category: UpdateCategoryDto): Promise<Category> {
        const categoryToUpdate = await Category.findByPk(id);
        
        if (!categoryToUpdate) {
            throw new Error('Categoría no encontrada');
        }
        
        await categoryToUpdate.update(category);
        return categoryToUpdate;
    }

    async delete(id: string): Promise<void> {
        const categoryToDelete = await Category.findByPk(id);
        
        if (!categoryToDelete) {
            throw new Error('Categoría no encontrada');
        }
        
        await categoryToDelete.destroy();
    }

    async search(query: string): Promise<Category[]> {
        return await Category.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.iLike]: `%${query}%` } }
                ]
            }
        });
    }
}
