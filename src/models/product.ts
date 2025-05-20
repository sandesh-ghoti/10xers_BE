import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import User from './user';

export interface ProductAttributes {
  id?: number;
  brand: string;
  modelName: string;
  description: string;
  price: number;
  publisher: number; // foreign key User.id
}

@Table({
  tableName: 'products',
})
export default class Product extends Model<ProductAttributes> implements ProductAttributes {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id',
  })
  id!: number;

  @Column({
    type: DataType.STRING(255),
    field: 'brand',
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Brand is required' },
    },
  })
  brand!: string;

  @Column({
    type: DataType.STRING(255),
    field: 'model_name',
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Model name is required' },
    },
  })
  modelName!: string;

  @Column({
    type: DataType.STRING(255),
    field: 'description',
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Description is required' },
    },
  })
  description!: string;

  @Column({
    type: DataType.INTEGER,
    field: 'price',
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Price is required' },
    },
  })
  price!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    field: 'publisher',
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Publisher is required' },
    },
  })
  publisher!: number;
}
