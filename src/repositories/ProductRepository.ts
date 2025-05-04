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
      cost: product.cost,
      wholesale_price: product.wholesale_price,
      retail_price: product.retail_price,
      image: product.image,
      unit_measurement: product.unit_measurement,
      sku: product.sku,
      stock: product.stock,
      status: product.status || ProductStatus.ACTIVE
    });
  }

  async update(id: string, product: CreateProductDto): Promise<Product> {
    const existingProduct = await this.findById(id);
    if (!existingProduct) {
      throw new Error('Product not found');
    }
    await existingProduct.update({
      name: product.name,
      description: product.description,
      cost: product.cost,
      wholesale_price: product.wholesale_price,
      retail_price: product.retail_price,
      image: product.image,
      unit_measurement: product.unit_measurement,
      sku: product.sku,
      stock: product.stock
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