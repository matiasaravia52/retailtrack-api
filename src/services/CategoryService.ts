import Category from '../models/Category';
import { ICategoryService } from '../interfaces/service/ICategoryService';
import { ICategoryRepository } from '../interfaces/repository/ICategoryRepository';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/CategoryDto';

export class CategoryService implements ICategoryService {
    private categoryRepository: ICategoryRepository;

    constructor(categoryRepository: ICategoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    async getAllCategories(): Promise<Category[]> {
        return await this.categoryRepository.findAll();
    }

    async getCategoryById(id: string): Promise<Category | null> {
        return await this.categoryRepository.findById(id);
    }

    async createCategory(categoryData: CreateCategoryDto): Promise<Category> {
        return await this.categoryRepository.create(categoryData);
    }

    async updateCategory(id: string, categoryData: UpdateCategoryDto): Promise<Category> {
        return await this.categoryRepository.update(id, categoryData);
    }

    async deleteCategory(id: string): Promise<void> {
        await this.categoryRepository.delete(id);
    }

    async searchCategories(query: string): Promise<Category[]> {
        return await this.categoryRepository.search(query);
    }
}
