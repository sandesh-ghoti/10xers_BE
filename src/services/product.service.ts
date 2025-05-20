import { ProductAttributes } from '../models/product';
import { ProductRepository } from '../repository/product.repository';

export class ProductService {
  constructor(private productRepository: ProductRepository) {}
  async create(data: Omit<ProductAttributes, 'id'>) {
    const product = await this.productRepository.create(data);
    return product;
  }
  async findByAdmin(id: number) {
    const products = await this.productRepository.findByAdmin(id);
    return products;
  }
  async findByAdminEmail(email: string) {
    const products = await this.productRepository.findByAdminEmail(email);
    return products;
  }
  async updateProduct(id: number, data: Omit<ProductAttributes, 'id'>) {
    const product = await this.productRepository.update(id, data);
    return product;
  }
  async deleteProduct(id: number) {
    const product = await this.productRepository.delete(id);
    return product;
  }
  async findById(id: number) {
    const product = await this.productRepository.findById(id);
    return product;
  }
  async findAll() {
    const products = await this.productRepository.findAll();
    return products;
  }
}
