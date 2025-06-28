import Category from "../../models/Category";
import { CreateCategoryDto, UpdateCategoryDto } from "../../dto/CategoryDto";

export interface ICategoryRepository {
    findAll(): Promise<Category[]>;
    findById(id: string): Promise<Category | null>;
    create(category: CreateCategoryDto): Promise<Category>;
    update(id: string, category: UpdateCategoryDto): Promise<Category>;
    delete(id: string): Promise<void>;
    search(query: string): Promise<Category[]>;
}
