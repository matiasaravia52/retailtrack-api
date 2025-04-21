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

  async create(product: Product): Promise<Product> {
    await product.save();
    return product;
  }

  async update(id: string, product: Product): Promise<Product> {
    const existingProduct = await this.findById(id);
    if (!existingProduct) {
      throw new Error('Product not found');
    }
    await existingProduct.update(product);
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