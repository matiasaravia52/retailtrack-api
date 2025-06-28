import Category from "../../models/Category";
import { CreateCategoryDto, UpdateCategoryDto } from "../../dto/CategoryDto";

export interface ICategoryService {
    getAllCategories(): Promise<Category[]>;
    getCategoryById(id: string): Promise<Category | null>;
    createCategory(categoryData: CreateCategoryDto): Promise<Category>;
    updateCategory(id: string, categoryData: UpdateCategoryDto): Promise<Category>;
    deleteCategory(id: string): Promise<void>;
    searchCategories(query: string): Promise<Category[]>;
}
