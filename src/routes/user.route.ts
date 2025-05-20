import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserController } from '../controllers/user.controller';
import { AppError } from '../utils/appError';

const router = Router();
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
router.post('/logout', UserController.logout);
router.get('/current-user', UserController.currentUser);
router.post('/register-admin', UserController.registerAdmin);

export default router;
