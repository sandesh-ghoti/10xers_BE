import { scryptSync as scrypt } from 'crypto';
import { StatusCodes } from 'http-status-codes';
import { Role } from '../common';
import { SALT } from '../config/serverConfig';
import { UserRepository } from '../repository/user.repository';
import { AppError } from '../utils/appError';

export class UserService {
  constructor(private userRepository: UserRepository) {}
  async create(email: string, password: string) {
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new AppError('user already exits', StatusCodes.CONFLICT);
    }
    password = scrypt(password, SALT, 32).toString('hex');
    const user = await this.userRepository.create({ email, password });
    return user;
  }
  async findByEmail(email: string) {
    return await this.userRepository.findByEmail(email);
  }
  async authenticate(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new AppError('invalid credentials', StatusCodes.UNAUTHORIZED);
    }
    const hashedPassword = scrypt(password, SALT, 32).toString('hex');
    if (user.password !== hashedPassword) {
      throw new AppError('invalid credentials', StatusCodes.UNAUTHORIZED);
    }
    return user;
  }
  async updateRole(email: string, role: Role) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('user not found', StatusCodes.NOT_FOUND);
    }
    user.role = role;
    const updatedUser = await this.userRepository.update(user.id, { role: role });
    return updatedUser;
  }
}
