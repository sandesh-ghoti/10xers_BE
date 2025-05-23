import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserController } from '../controllers/user.controller';
import { AppError } from '../utils/appError';
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and login
 */

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post(
  '/register',
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.email || !req.body.password) {
      throw new AppError('Email and password required', StatusCodes.BAD_REQUEST);
    } else {
      next();
    }
  },
  UserController.register,
);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/login',
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.email || !req.body.password) {
      throw new AppError('Email and password required', StatusCodes.BAD_REQUEST);
    } else {
      next();
    }
  },
  UserController.login,
);

/**
 * @swagger
 * /user/logout:
 *   post:
 *     summary: Logout the current user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successfully logged out
 */
router.post('/logout', UserController.logout);
/**
 * @swagger
 * /user/current-user:
 *   get:
 *     summary: Get current logged in user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Current user data
 */
router.get('/current-user', UserController.currentUser);

/**
 * @swagger
 * /user/register-admin:
 *   post:
 *     summary: Update user to admin
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated user to admin
 *       401:
 *         description: Unauthorized
 */
router.post('/register-admin', UserController.registerAdmin);

export default router;
