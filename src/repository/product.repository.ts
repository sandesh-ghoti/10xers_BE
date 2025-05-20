import Product, { ProductAttributes } from '../models/product';
import User from '../models/user';
import { BaseRepository } from './crudrepository';

export class ProductRepository extends BaseRepository<Product, ProductAttributes> {
  constructor() {
    super(Product);
  }
  async findByAdmin(id: number): Promise<Array<Product> | null> {
    const result = await this.model.findAll({ where: { admin: id } });
    return result as Product[] | null;
  }
  async findByAdminEmail(email: string): Promise<Array<Product> | null> {
    const user = await User.findOne({ where: { email } });
    const result = await this.model.findAll({ where: { admin: user?.id } });
    return result as Product[] | null;
  }
}
