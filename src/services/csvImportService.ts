import { Readable } from 'stream';
import { parse } from 'csv-parse';
import { CreateProductDto } from '../dto/ProductDto';
import { ProductStatus } from '../models/Product';
import { IProductService } from '../interfaces/service/IProductService';
import { ICategoryService } from '../interfaces/service/ICategoryService';
import { CategoryStatus } from '../models/Category';

// Definir la interfaz para los registros CSV
interface ProductCsvRecord {
  name: string;
  description: string;
  categoryName?: string; // Cambiado de categoryId a categoryName
  stock?: string;
  retail_price?: string;
  wholesale_price?: string;
  status?: string;
}

export interface ImportResult {
  success: boolean;
  totalProcessed: number;
  successCount: number;
  errorCount: number;
  errors: Array<{ row: number; message: string }>;
  successItems: Array<{ name: string; id: string }>;
}

export class CsvImportService {
  private productService: IProductService;
  private categoryService: ICategoryService;

  constructor(productService: IProductService, categoryService: ICategoryService) {
    this.productService = productService;
    this.categoryService = categoryService;
  }

  /**
   * Importa productos desde un archivo CSV
   * @param fileBuffer Buffer del archivo CSV
   * @returns Resultado de la importación
   */
  async importProductsFromCsv(fileBuffer: Buffer): Promise<ImportResult> {
    console.log('Iniciando importación CSV, tamaño del buffer:', fileBuffer.length);
    
    const result: ImportResult = {
      success: false,
      totalProcessed: 0,
      successCount: 0,
      errorCount: 0,
      errors: [],
      successItems: []
    };

    return new Promise((resolve) => {
      // Crear un stream legible a partir del buffer
      const stream = Readable.from(fileBuffer);
      console.log('Stream creado correctamente');

      // Configurar el parser CSV
      const parser = parse({
        columns: true, // La primera fila contiene los nombres de las columnas
        skip_empty_lines: true,
        trim: true,
        quote: '"', // Carácter de comillas
        escape: '"', // Carácter de escape para comillas
        relax_quotes: true, // Permitir comillas dentro de campos
        relax_column_count: true // Permitir filas con diferente número de columnas
      });

      // Procesar el CSV
      const records: any[] = [];
      
      stream
        .pipe(parser)
        .on('data', (record) => {
          console.log('Registro CSV recibido:', record);
          records.push(record);
        })
        .on('end', async () => {
          console.log('Fin del parsing CSV. Registros encontrados:', records.length);
          result.totalProcessed = records.length;
          
          // Procesar cada registro
          for (let i = 0; i < records.length; i++) {
            try {
              const record = records[i];
              const rowNumber = i + 2; // +2 porque la fila 1 es el encabezado
              
              // Validar y transformar los datos
              console.log(`Procesando registro ${i+1}/${records.length}, fila ${rowNumber}`);
              const productData = await this.validateAndTransformProductData(record, rowNumber);
              
              if (productData) {
                console.log('Datos de producto validados:', productData);
                // Crear el producto
                const product = await this.productService.createProduct(productData);
                console.log('Producto creado:', product.id, product.name);
                result.successCount++;
                result.successItems.push({ name: product.name, id: product.id });
              }
            } catch (error) {
              result.errorCount++;
              result.errors.push({
                row: i + 2, // +2 porque la fila 1 es el encabezado
                message: error instanceof Error ? error.message : 'Error desconocido'
              });
            }
          }
          
          result.success = result.errorCount === 0;
          console.log('Importación finalizada:', result);
          resolve(result);
        })
        .on('error', (error: Error) => {
          console.error('Error en el parsing CSV:', error);
          result.success = false;
          result.errors.push({ row: 0, message: `Error al procesar el CSV: ${error.message}` });
          resolve(result);
        });
    });
  }

  /**
   * Valida y transforma los datos del CSV en un objeto CreateProductDto
   * @param record Registro del CSV
   * @param rowNumber Número de fila para reportar errores
   * @returns Objeto CreateProductDto validado
   */
  private async validateAndTransformProductData(record: ProductCsvRecord, rowNumber: number): Promise<CreateProductDto> {
    const errors: string[] = [];

    // Validar campos obligatorios
    if (!record.name) {
      errors.push('El nombre del producto es obligatorio');
    }

    if (!record.description) {
      errors.push('La descripción del producto es obligatoria');
    }

    // Validar campos numéricos
    let stock = 0;
    if (record.stock) {
      stock = Number(record.stock);
      if (isNaN(stock) || stock < 0) {
        errors.push('El stock debe ser un número mayor o igual a cero');
      }
    }

    let retail_price = 0;
    if (record.retail_price) {
      retail_price = Number(record.retail_price);
      if (isNaN(retail_price) || retail_price < 0) {
        errors.push('El precio minorista debe ser un número mayor o igual a cero');
      }
    }

    let wholesale_price = 0;
    if (record.wholesale_price) {
      wholesale_price = Number(record.wholesale_price);
      if (isNaN(wholesale_price) || wholesale_price < 0) {
        errors.push('El precio mayorista debe ser un número mayor o igual a cero');
      }
    }

    // Validar estado
    let status = ProductStatus.ACTIVE;
    if (record.status) {
      if (record.status.toLowerCase() === 'inactive') {
        status = ProductStatus.INACTIVE;
      } else if (record.status.toLowerCase() !== 'active') {
        errors.push('El estado debe ser "active" o "inactive"');
      }
    }

    // Si hay errores, lanzar excepción
    if (errors.length > 0) {
      throw new Error(`Errores en la fila ${rowNumber}: ${errors.join(', ')}`);
    }

    // Procesar la categoría por nombre
    let categoryId: string | undefined = undefined;
    
    if (record.categoryName) {
      // Buscar categoría por nombre
      const categories = await this.categoryService.searchCategories(record.categoryName);
      
      if (categories && categories.length > 0) {
        // Usar la primera categoría encontrada
        categoryId = categories[0].id;
      } else {
        // Crear nueva categoría si no existe
        const newCategory = await this.categoryService.createCategory({
          name: record.categoryName,
          status: CategoryStatus.ACTIVE // Usar el estado activo por defecto
        });
        categoryId = newCategory.id;
      }
    }

    // Crear y retornar el objeto CreateProductDto
    return {
      name: record.name,
      description: record.description,
      status,
      categoryId,
      stock,
      retail_price,
      wholesale_price
    };
  }
}

export default CsvImportService;
