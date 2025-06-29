import { IProductService } from '../interfaces/service/IProductService';
import { ProductFilters, PaginatedResult } from '../interfaces/repository/IProductRepository';
import { IProductRepository } from '../interfaces/repository/IProductRepository';
import Product from '../models/Product';
import { CreateProductDto } from '../dto/ProductDto';
import { sequelize } from '../config/database';
import { StockMovementType } from '../models/StockMovements';
import { v4 as uuidv4 } from 'uuid';

export class ProductService implements IProductService {
  private productRepository: IProductRepository;
  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  async getAllProducts(filters?: ProductFilters): Promise<PaginatedResult<Product>> {
    return this.productRepository.findAll(filters);
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.productRepository.findById(id);
  }

  async createProduct(productData: CreateProductDto): Promise<Product> {
    const transaction = await sequelize.transaction();
    
    try {
      // Crear el producto con stock inicial 0 (el stock se actualizará al crear el lote)
      const initialStock = productData.stock || 0;
      const productToCreate = {
        ...productData,
        stock: 0 // Inicialmente 0, se actualizará al crear el lote
      };
      
      // Crear el producto
      const createdProduct = await this.productRepository.create(productToCreate, { transaction });
      
      // Si hay stock inicial, crear un lote inicial
      if (initialStock > 0) {
        // Crear un lote inicial para el producto
        const batchId = uuidv4();
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        
        await sequelize.models.Batch.create({
          id: batchId,
          productId: createdProduct.id,
          initialQuantity: initialStock,
          availableQuantity: initialStock,
          unitCost: 0, // Costo inicial 0, ya que no se especifica en la creación del producto
          expirationDate: oneYearFromNow
        }, { transaction });
        
        // Registrar el movimiento de stock
        await sequelize.models.StockMovements.create({
          productId: createdProduct.id,
          batchId: batchId,
          type: StockMovementType.IN,
          quantity: initialStock,
          unitCost: 0,
          notes: `Stock inicial al crear producto #${createdProduct.id}`
        }, { transaction });
        
        // Actualizar el stock total del producto
        await createdProduct.update({ stock: initialStock }, { transaction });
      }
      
      await transaction.commit();
      return createdProduct;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
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
    try {
      await this.productRepository.delete(id);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error;
    }
  }

  async searchProducts(query: string, filters?: ProductFilters): Promise<PaginatedResult<Product>> {
    return this.productRepository.search(query, filters);
  }
}

export default ProductService;

