import { Request, Response, NextFunction } from 'express';
import { CsvImportService } from '../services/csvImportService';
import { IProductService } from '../interfaces/service/IProductService';
import { ICategoryService } from '../interfaces/service/ICategoryService';
import multer from 'multer';
import { ApiError } from '../middleware/errorHandler';

// Extender la interfaz Request para incluir el archivo
declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File;
    }
  }
}

// Configuración de multer para manejar la carga de archivos
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limitar a 5MB
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Aceptar solo archivos CSV
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos CSV'));
    }
  },
});

export class CsvImportController {
  private csvImportService: CsvImportService;

  constructor(productService: IProductService, categoryService: ICategoryService) {
    this.csvImportService = new CsvImportService(productService, categoryService);
  }

  // Middleware para manejar la carga de archivos
  uploadMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      console.log('Middleware de carga iniciado');
      console.log('Headers recibidos:', req.headers);
      
      const singleUpload = upload.single('file');
      singleUpload(req, res, (err: any) => {
        if (err) {
          console.error('Error en multer:', err);
          if (err instanceof multer.MulterError) {
            // Error de multer (tamaño de archivo, etc.)
            return next(new ApiError(`Error al cargar el archivo: ${err.message}`, 400));
          } else {
            // Error personalizado (tipo de archivo incorrecto)
            return next(new ApiError(`Error al cargar el archivo: ${err.message}`, 400));
          }
        }
        
        console.log('Archivo recibido en middleware:', req.file ? 'SÍ' : 'NO');
        if (req.file) {
          console.log('Nombre del archivo:', req.file.originalname);
          console.log('Tamaño del archivo:', req.file.size, 'bytes');
        }
        
        next();
      });
    };
  }

  // Controlador para importar productos desde CSV
  async importProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log('Request body:', req.body);
      console.log('Request file:', req.file);
      
      if (!req.file) {
        console.error('No se recibió ningún archivo en la solicitud');
        console.log('Contenido de la solicitud:', req);
        throw new ApiError('No se ha proporcionado ningún archivo', 400);
      }

      console.log('Archivo recibido, tamaño:', req.file.buffer.length, 'bytes');
      console.log('Contenido del archivo (primeros 200 bytes):', req.file.buffer.slice(0, 200).toString());
      
      try {
        const result = await this.csvImportService.importProductsFromCsv(req.file.buffer);
        console.log('Resultado de importación:', result);
        
        res.status(200).json({
          success: true,
          message: 'Importación completada',
          data: result
        });
      } catch (importError: unknown) {
        console.error('Error durante la importación:', importError);
        const errorMessage = importError instanceof Error ? importError.message : 'Error desconocido';
        next(new ApiError(`Error durante la importación: ${errorMessage}`, 500));
      }
    } catch (error) {
      next(error);
    }
  }

  // Controlador para descargar una plantilla CSV de ejemplo
  async downloadTemplate(req: Request, res: Response): Promise<void> {
    try {
      // Crear una plantilla CSV con los encabezados
      const headers = ['name', 'description', 'categoryName', 'stock', 'retail_price', 'wholesale_price', 'status'];
      const exampleRow = ['Producto Ejemplo', 'Descripción del producto', 'Electrónicos', '10', '100', '80', 'active'];
      
      const csvContent = [
        headers.join(','),
        exampleRow.join(',')
      ].join('\n');
      
      // Configurar los headers para la descarga
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=plantilla_productos.csv');
      
      // Enviar el contenido CSV
      res.status(200).send(csvContent);
    } catch (error) {
      console.error('Error al generar la plantilla CSV:', error);
      res.status(500).json({
        success: false,
        message: 'Error al generar la plantilla CSV',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}

export default CsvImportController;
