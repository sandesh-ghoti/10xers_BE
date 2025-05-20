import { scryptSync as scrypt } from 'crypto';
import { StatusCodes } from 'http-status-codes';
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
}
