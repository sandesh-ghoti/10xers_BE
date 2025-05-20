import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Role } from '../common';
import { UserRepository } from '../repository/user.repository';
import { UserService } from '../services/user.service';
import { AppError } from '../utils/appError';
import { getPayload, signjwt } from '../utils/jwtService';
import { successResponse } from '../utils/response';

const userService = new UserService(new UserRepository());

export class UserController {
  static async register(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await userService.create(email, password);
    if (!user) {
      throw new AppError('user not created', StatusCodes.INTERNAL_SERVER_ERROR);
    }
    res.status(StatusCodes.CREATED).json(successResponse(null, 'User created successfully'));
  }
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email and password are required', StatusCodes.BAD_REQUEST);
    }

    const user = await userService.authenticate(email, password);

    const userJwt = signjwt({ id: user.id, email: user.email, role: user.role });

    req.session = { jwt: userJwt };

    res.status(StatusCodes.OK).json(successResponse(user, 'Logged in successfully'));
  }

  static async logout(req: Request, res: Response) {
    req.session = null;
    res.status(StatusCodes.OK).json(successResponse(null, 'Logged out successfully'));
  }

  static async currentUser(req: Request, res: Response) {
    const token = req.session?.jwt;

    if (!token) {
      throw new AppError('Not authenticated', StatusCodes.UNAUTHORIZED);
    }

    try {
      const payload = getPayload(token);
      res.status(StatusCodes.OK).json(successResponse(payload, 'User fetched successfully'));
    } catch {
      throw new AppError('Invalid token', StatusCodes.UNAUTHORIZED);
    }
  }
  static async registerAdmin(req: Request, res: Response) {
    const token = req.session?.jwt;
    if (!token) {
      throw new AppError('Not authenticated', StatusCodes.UNAUTHORIZED);
    }

    const payload = getPayload(token) as any;
    if (payload.role !== Role.SYSTEM_ADMIN) {
      throw new AppError('Unauthorized', StatusCodes.UNAUTHORIZED);
    }

    const { email } = req.body;
    const updateRole = await userService.updateRole(email, Role.ADMIN);
    if (!updateRole) {
      throw new AppError('user not updated', StatusCodes.INTERNAL_SERVER_ERROR);
    }
    res.status(StatusCodes.CREATED).json(successResponse(null, 'User updated successfully'));
  }
}
