import { IProductService } from '../interfaces/service/IProductService';
import { IProductRepository } from '../interfaces/repository/IProductRepository';
import Product from '../models/Product';
import { CreateProductDto } from '../dto/ProductDto';

export class ProductService implements IProductService {
  private productRepository: IProductRepository;
  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.productRepository.findById(id);
  }

  async createProduct(productData: CreateProductDto): Promise<Product> {
    // Usar directamente el DTO en lugar de crear una instancia de Product
    const createdProduct = await this.productRepository.create(productData);
    return createdProduct;
  }

  async updateProduct(id: string, productData: CreateProductDto): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    // Usar directamente el DTO en lugar de modificar la instancia de Product
    return this.productRepository.update(id, productData);
  }

  async deleteProduct(id: string): Promise<void> {
    return this.productRepository.delete(id);
  }

  async searchProducts(query: string): Promise<Product[]> {
    return this.productRepository.search(query);
  }
}

export default ProductService;

