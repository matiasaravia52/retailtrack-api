import { CategoryStatus } from '../models/Category';

export interface CreateCategoryDto {
    name: string;
    status?: CategoryStatus;
}

export interface UpdateCategoryDto {
    name?: string;
    status?: CategoryStatus;
}
