import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserRepository } from '../repository/user.repository';
import { UserService } from '../services/user.service';
import { AppError } from '../utils/appError';
import { getPayload, signjwt } from '../utils/jwtService';

const userService = new UserService(new UserRepository());

export class UserController {
  static async register(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await userService.create(email, password);
    res.status(StatusCodes.CREATED).json({ message: 'User created successfully' });
  }
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email and password are required', StatusCodes.BAD_REQUEST);
    }

    const user = await userService.authenticate(email, password);

    const userJwt = signjwt({ id: user.id, email: user.email, role: user.role });

    req.session = { jwt: userJwt };

    res.status(StatusCodes.OK).json({ message: 'Logged in successfully', user });
  }

  static async logout(req: Request, res: Response) {
    req.session = null;
    res.status(StatusCodes.OK).json({ message: 'Logged out successfully' });
  }

  static async currentUser(req: Request, res: Response) {
    const token = req.session?.jwt;

    if (!token) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Not authenticated' });
    }

    try {
      const payload = getPayload(token);
      res.status(StatusCodes.OK).json({ user: payload });
    } catch {
      throw new AppError('Invalid token', StatusCodes.UNAUTHORIZED);
    }
  }
}
