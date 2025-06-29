import { Op, Transaction, Order } from 'sequelize';
import Product, { ProductStatus } from '../models/Product';
import { IProductRepository, ProductFilters, PaginatedResult } from '../interfaces/repository/IProductRepository';
import { CreateProductDto } from '../dto/ProductDto';
import Category from '../models/Category';

export class ProductRepository implements IProductRepository {
  async findAll(filters?: ProductFilters): Promise<PaginatedResult<Product>> {
    const whereClause: any = {};
    const orderOptions: Order = [];
    
    // Valores por defecto para paginación
    const page = filters?.page && filters.page > 0 ? filters.page : 1;
    const limit = filters?.limit && filters.limit > 0 ? filters.limit : 10;
    const offset = (page - 1) * limit;
    
    // Aplicar filtros si existen
    if (filters) {
      // Filtrar por estado
      if (filters.status) {
        whereClause.status = filters.status;
      }
      
      // Filtrar por categoría
      if (filters.categoryId) {
        whereClause.categoryId = filters.categoryId;
      }
      
      // Aplicar ordenamiento
      if (filters.sortBy) {
        const validColumns = ['name', 'createdAt', 'updatedAt', 'retail_price', 'wholesale_price', 'stock'];
        if (validColumns.includes(filters.sortBy)) {
          const sortOrder = filters.sortOrder === 'DESC' ? 'DESC' : 'ASC';
          orderOptions.push([filters.sortBy, sortOrder]);
        }
      }
    }
    
    // Obtener el total de registros para calcular el número total de páginas
    const count = await Product.count({ where: whereClause });
    
    // Obtener los productos paginados
    const products = await Product.findAll({
      where: whereClause,
      order: orderOptions.length > 0 ? orderOptions : [['updatedAt', 'DESC']],
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      }],
      limit,
      offset
    });
    
    // Calcular el número total de páginas
    const totalPages = Math.ceil(count / limit);
    
    // Devolver el resultado paginado
    return {
      items: products,
      total: count,
      page,
      limit,
      totalPages
    };
  }

  async findById(id: string): Promise<Product | null> {
    return Product.findByPk(id);
  }

  async create(product: CreateProductDto, options?: { transaction?: Transaction }): Promise<Product> {
    return Product.create({
      name: product.name,
      description: product.description,
      status: product.status || ProductStatus.ACTIVE,
      categoryId: product.categoryId || null,
      stock: product.stock || 0,
      retail_price: product.retail_price || 0,
      wholesale_price: product.wholesale_price || 0
    }, options);
  }

  async update(id: string, product: CreateProductDto, options?: { transaction?: Transaction }): Promise<Product> {
    const existingProduct = await this.findById(id);
    if (!existingProduct) {
      throw new Error('Product not found');
    }
    
    const updateData: any = {};
    
    if (product.name !== undefined) updateData.name = product.name;
    if (product.description !== undefined) updateData.description = product.description;
    if (product.status !== undefined) updateData.status = product.status;
    if (product.categoryId !== undefined) updateData.categoryId = product.categoryId;
    if (product.stock !== undefined) updateData.stock = product.stock;

    if (product.retail_price !== undefined) updateData.retail_price = product.retail_price;
    if (product.wholesale_price !== undefined) updateData.wholesale_price = product.wholesale_price;
    
    await existingProduct.update(updateData, options);
    return existingProduct;
  }

  async delete(id: string): Promise<void> {
    const product = await Product.findByPk(id);
    if (!product) {
      throw new Error('Product not found');
    }
    
    // Implementar eliminación lógica: cambiar estado a inactivo en lugar de eliminar físicamente
    await product.update({ status: ProductStatus.INACTIVE });
  }

  async search(query: string, filters?: ProductFilters): Promise<PaginatedResult<Product>> {
    const whereClause: any = {
      [Op.or]: [
        { name: { [Op.iLike]: `%${query}%` } },
        { description: { [Op.iLike]: `%${query}%` } }
      ]
    };
    
    const orderOptions: Order = [];
    
    // Valores por defecto para paginación
    const page = filters?.page && filters.page > 0 ? filters.page : 1;
    const limit = filters?.limit && filters.limit > 0 ? filters.limit : 10;
    const offset = (page - 1) * limit;
    
    // Aplicar filtros adicionales si existen
    if (filters) {
      // Filtrar por estado
      if (filters.status) {
        whereClause.status = filters.status;
      }
      
      // Filtrar por categoría
      if (filters.categoryId) {
        whereClause.categoryId = filters.categoryId;
      }
      
      // Aplicar ordenamiento
      if (filters.sortBy) {
        const validColumns = ['name', 'createdAt', 'updatedAt', 'retail_price', 'wholesale_price', 'stock'];
        if (validColumns.includes(filters.sortBy)) {
          const sortOrder = filters.sortOrder === 'DESC' ? 'DESC' : 'ASC';
          orderOptions.push([filters.sortBy, sortOrder]);
        }
      }
    }
    
    // Obtener el total de registros para calcular el número total de páginas
    const count = await Product.count({ where: whereClause });
    
    // Obtener los productos paginados
    const products = await Product.findAll({
      where: whereClause,
      order: orderOptions.length > 0 ? orderOptions : [['updatedAt', 'DESC']],
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      }],
      limit,
      offset
    });
    
    // Calcular el número total de páginas
    const totalPages = Math.ceil(count / limit);
    
    // Devolver el resultado paginado
    return {
      items: products,
      total: count,
      page,
      limit,
      totalPages
    };
  }
}