import { Op } from 'sequelize';
import Product from '../models/Product';
import { IProductRepository } from '../interfaces/repository/IProductRepository';

export class ProductRepository implements IProductRepository {
  async findAll(): Promise<Product[]> {
    return Product.findAll();
  }

  async findById(id: string): Promise<Product | null> {
    return Product.findByPk(id);
  }

  async create(product: { name: string; description: string }): Promise<Product> {
    return Product.create({
      name: product.name,
      description: product.description
    });
  }

  async update(id: string, product: { name: string; description: string }): Promise<Product> {
    const existingProduct = await this.findById(id);
    if (!existingProduct) {
      throw new Error('Product not found');
    }
    await existingProduct.update({
      name: product.name,
      description: product.description
    });
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