import User, { UserAttributes } from '../models/user';
import { BaseRepository } from './crudrepository';

export class UserRepository extends BaseRepository<User, UserAttributes> {
  constructor() {
    super(User);
  }
  async findByEmail(email: string): Promise<User | null> {
    const result = await this.model.findOne({ where: { email } });
    return result as User | null;
  }
}
