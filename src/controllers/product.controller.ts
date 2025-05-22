import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Role } from '../common';
import { ProductRepository } from '../repository/product.repository';
import { ProductService } from '../services/product.service';
import { AppError } from '../utils/appError';
import { successResponse } from '../utils/response';

const productService = new ProductService(new ProductRepository());

export class ProductController {
  static async create(req: Request, res: Response) {
    const { user } = req.session as any;
    if (!user || user.role !== Role.ADMIN) {
      throw new AppError('Not authenticated', StatusCodes.UNAUTHORIZED);
    }

    const { brand, modelName, description, price } = req.body;
    const admin = user.id;

    const product = await productService.create({
      brand,
      description,
      modelName,
      price,
      admin,
    });
    if (!product) {
      throw new AppError('Product not created', StatusCodes.INTERNAL_SERVER_ERROR);
    }
    res.status(StatusCodes.CREATED).json(successResponse(product, 'Product created successfully'));
  }

  static async getProducts(req: Request, res: Response) {
    const products = await productService.findAll();
    if (!products) {
      throw new AppError('Products not found', StatusCodes.NOT_FOUND);
    }
    res.status(StatusCodes.OK).json(successResponse(products, 'Products fetched successfully'));
  }
  static async getProduct(req: Request, res: Response) {
    const { id } = req.params;
    const product = await productService.findById(Number(id));
    if (!product) {
      throw new AppError('Product not found', StatusCodes.NOT_FOUND);
    }
    res.status(StatusCodes.OK).json(successResponse(product, 'Product fetched successfully'));
  }
  static async getProductsByAdmin(req: Request, res: Response) {
    const { user } = req.session as any;
    if (!user || user.role !== Role.ADMIN) {
      throw new AppError('Not authenticated', StatusCodes.UNAUTHORIZED);
    }
    const products = await productService.findByAdmin(user.id);
    if (!products) {
      throw new AppError('Products not found', StatusCodes.NOT_FOUND);
    }
    res.status(StatusCodes.OK).json(successResponse(products, 'Products fetched successfully'));
  }
  static async getProductsByAdminEmail(req: Request, res: Response) {
    const { email } = req.params;
    const products = await productService.findByAdminEmail(email);
    if (!products) {
      throw new AppError('Products not found', StatusCodes.NOT_FOUND);
    }
    res.status(StatusCodes.OK).json(successResponse(products, 'Products fetched successfully'));
  }

  static async deleteProduct(req: Request, res: Response) {
    const { user } = req.session as any;
    if (!user || user.role !== Role.ADMIN) {
      throw new AppError('Not authenticated', StatusCodes.UNAUTHORIZED);
    }
    const { id } = req.params;
    const product = await productService.findById(Number(id));
    if (!product) {
      throw new AppError('Product not found', StatusCodes.NOT_FOUND);
    }
    if (product.admin !== user.id) {
      throw new AppError('Unauthorized', StatusCodes.UNAUTHORIZED);
    }
    const result = await productService.deleteProduct(Number(id));
    if (!result) {
      throw new AppError('Product not deleted', StatusCodes.INTERNAL_SERVER_ERROR);
    }
    res.status(StatusCodes.OK).json(successResponse(product, 'Product deleted successfully'));
  }

  static async updateProduct(req: Request, res: Response) {
    const { user } = req.session as any;
    if (!user || user.role !== Role.ADMIN) {
      throw new AppError('Not authenticated', StatusCodes.UNAUTHORIZED);
    }
    const { id } = req.params;
    const product = await productService.findById(Number(id));
    if (!product) {
      throw new AppError('Product not found', StatusCodes.NOT_FOUND);
    }
    if (product.admin !== user.id) {
      throw new AppError('Unauthorized', StatusCodes.UNAUTHORIZED);
    }
    const { brand, modelName, description, price } = req.body;
    const result = await productService.updateProduct(Number(id), {
      brand,
      description,
      modelName,
      price,
      admin: user.id,
    });
    if (!result) {
      throw new AppError('Product not updated', StatusCodes.INTERNAL_SERVER_ERROR);
    }
    res.status(StatusCodes.OK).json(successResponse(result, 'Product updated successfully'));
  }
}
