import {
  CreateOptions,
  DestroyOptions,
  FindOptions,
  Model,
  ModelStatic,
  UpdateOptions,
  WhereOptions,
} from 'sequelize';

export abstract class BaseRepository<
  T extends Model<TModelAttributes>,
  TModelAttributes extends {},
> {
  protected model: ModelStatic<T>;

  constructor(model: ModelStatic<T>) {
    this.model = model;
  }

  async findAll(options?: FindOptions<TModelAttributes>): Promise<T[]> {
    return await this.model.findAll(options);
  }

  async findById(id: number): Promise<T | null> {
    return await this.model.findByPk(id);
  }

  async findOne(where: WhereOptions<TModelAttributes>): Promise<T | null> {
    return await this.model.findOne({ where });
  }

  async create(data: any, options?: CreateOptions): Promise<T> {
    return await this.model.create(data, options);
  }

  async update(id: number, data: any, options?: UpdateOptions): Promise<T | null> {
    const instance = await this.model.findByPk(id);
    if (!instance) return null;
    return await instance.update(data, options);
  }

  async delete(id: number, options?: DestroyOptions): Promise<boolean> {
    const instance = await this.model.findByPk(id);
    if (!instance) return false;
    await instance.destroy(options);
    return true;
  }
}
