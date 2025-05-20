import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ProductController } from '../controllers/product.controller';
import { AppError } from '../utils/appError';

const router = Router();
router.post(
  '/create',
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.brand || !req.body.model || !req.body.description || !req.body.price) {
      throw new AppError('Brand, model, description and price required', StatusCodes.BAD_REQUEST);
    } else {
      next();
    }
  },
  ProductController.create,
);

router.get(
  '/get/:id',
  (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      throw new AppError('product id required in url params', StatusCodes.BAD_REQUEST);
    } else {
      next();
    }
  },
  ProductController.getProduct,
);
router.get('/', ProductController.getProducts);

router.get(
  '/admin/:email',
  (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.params;
    if (!email) {
      throw new AppError('admin email id required in url params', StatusCodes.BAD_REQUEST);
    } else {
      next();
    }
  },
  ProductController.getProductsByAdminEmail,
);
router.get('/admin', ProductController.getProductsByAdmin);

router.delete(
  '/:id',
  (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      throw new AppError('product id required in url params', StatusCodes.BAD_REQUEST);
    } else {
      next();
    }
  },
  ProductController.deleteProduct,
);
router.put(
  '/:id',
  (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      throw new AppError('product id required in url params', StatusCodes.BAD_REQUEST);
    } else {
      next();
    }
  },
  ProductController.updateProduct,
);
export default router;
