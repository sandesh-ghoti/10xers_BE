// tests/user.service.test.ts
import { scryptSync as scrypt } from 'crypto';
import { Role } from '../../common';
import { AppError } from '../../utils/appError';
import { UserService } from '../user.service';
const SALT = 'salt';

jest.mock('crypto', () => ({
  scryptSync: jest.fn(),
}));
// mock User save method
const mockUserRepository = {
  findByEmail: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
};

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService(mockUserRepository as any);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should throw error if user already exists', async () => {
      mockUserRepository.findByEmail.mockResolvedValue({ id: 1, email: 'test@example.com' });

      await expect(userService.create('test@example.com', 'password')).rejects.toThrow(AppError);
      await expect(userService.create('test@example.com', 'password')).rejects.toThrow(
        'user already exits',
      );
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should create user if email not found', async () => {
      // Arrange
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        role: Role.USER,
      });
      jest.mocked(scrypt).mockReturnValue(Buffer.from('hashedPassword'));
      // Act
      const result = await userService.create('test@example.com', 'password');
      // Assert
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: Buffer.from('hashedPassword').toString('hex'),
      });
      expect(result).toEqual({ id: 1, email: 'test@example.com', role: Role.USER });
    });
  });

  describe('authenticate', () => {
    it('should throw error if user not found', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      await expect(userService.authenticate('test@example.com', 'password')).rejects.toThrow(
        'invalid credentials',
      );
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should throw error if password is incorrect', async () => {
      // Arrange
      mockUserRepository.findByEmail.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: Buffer.from('hashedPassword').toString('hex'),
      });
      jest.mocked(scrypt).mockReturnValue(Buffer.from('wrongPassword'));

      // Act & Assert
      await expect(userService.authenticate('test@example.com', 'wrongPassword')).rejects.toThrow(
        'invalid credentials',
      );
    });
    it('should return user if password is correct', async () => {
      // Arrange
      const password = Buffer.from('hashedPassword');
      Buffer.from('hashedPassword');
      mockUserRepository.findByEmail.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: password.toString('hex'),
        role: Role.USER,
      });
      jest.mocked(scrypt).mockReturnValue(password);
      // Act
      const result = await userService.authenticate('test@example.com', 'password');
      // Assert
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        password: password.toString('hex'),
        role: Role.USER,
      });
    });
  });
  describe('updateRole', () => {
    it('should throw error if user not found', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      await expect(userService.updateRole('test@example.com', Role.ADMIN)).rejects.toThrow(
        'user not found',
      );
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
    });
    it('should update user role', async () => {
      // Arrange
      const password = Buffer.from('hashedPassword').toString('hex');
      mockUserRepository.findByEmail.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password,
        role: Role.USER,
      });
      mockUserRepository.update.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password,
        role: Role.ADMIN,
      });
      // Act
      const result = await userService.updateRole('test@example.com', Role.ADMIN);
      // Assert
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        password,
        role: Role.ADMIN,
      });
    });
  });
});
