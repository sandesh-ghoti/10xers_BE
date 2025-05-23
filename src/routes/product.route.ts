import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ProductController } from '../controllers/product.controller';
import { AppError } from '../utils/appError';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * /product/create:
 *   post:
 *     summary: Create a product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [brand, modelName, description, price]
 *             properties:
 *               brand:
 *                 type: string
 *               modelName:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Product created
 */
router.post(
  '/create',
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.brand || !req.body.modelName || !req.body.description || !req.body.price) {
      throw new AppError(
        'Brand, modelName, description and price required',
        StatusCodes.BAD_REQUEST,
      );
    } else {
      next();
    }
  },
  ProductController.create,
);
/**
 * @swagger
 * /product/get/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product found
 */
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

/**
 * @swagger
 * /product:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all products
 */
router.get('/', ProductController.getProducts);

/**
 * @swagger
 * /product/admin/{email}:
 *   get:
 *     summary: Get products by admin email
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Products for admin email
 */
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
/**
 * @swagger
 * /product/admin:
 *   delete:
 *     summary: Get All product by admin
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all products
 *       401:
 *         description: Unauthorized
 */
router.get('/admin', ProductController.getProductsByAdmin);

/**
 * @swagger
 * /product/{id}:
 *   delete:
 *     summary: Delete product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted
 */
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

/**
 * @swagger
 * /product/{id}:
 *   put:
 *     summary: Update product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [brand, modelName, description, price]
 *             properties:
 *               brand:
 *                 type: string
 *               modelName:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Product updated
 */
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
