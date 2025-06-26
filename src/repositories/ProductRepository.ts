import { Op } from 'sequelize';
import Product, { ProductStatus } from '../models/Product';
import { IProductRepository } from '../interfaces/repository/IProductRepository';
import { CreateProductDto } from '../dto/ProductDto';

export class ProductRepository implements IProductRepository {
  async findAll(): Promise<Product[]> {
    return Product.findAll();
  }

  async findById(id: string): Promise<Product | null> {
    return Product.findByPk(id);
  }

  async create(product: CreateProductDto): Promise<Product> {
    return Product.create({
      name: product.name,
      description: product.description,
      status: product.status || ProductStatus.ACTIVE,
      categoryId: product.categoryId || null,
      stock: product.stock || 0,
      cost: product.cost || 0,
      retail_price: product.retail_price || 0,
      wholesale_price: product.wholesale_price || 0
    });
  }

  async update(id: string, product: CreateProductDto): Promise<Product> {
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
    if (product.cost !== undefined) updateData.cost = product.cost;
    if (product.retail_price !== undefined) updateData.retail_price = product.retail_price;
    if (product.wholesale_price !== undefined) updateData.wholesale_price = product.wholesale_price;
    
    await existingProduct.update(updateData);
    return existingProduct;
  }

  async delete(id: string): Promise<void> {
    await Product.destroy({ where: { id } });
  }

  async search(query: string): Promise<Product[]> {
    return Product.findAll({
      where: {
        name: {
          [Op.iLike]: `%${query}%`
        }
      }
    });
  }
}