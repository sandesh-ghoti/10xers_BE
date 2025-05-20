import { Column, DataType, Model, Table } from 'sequelize-typescript';
enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

export interface UserAttributes {
  id?: number;
  email: string;
  password: string;
  role?: Role;
}

@Table({
  tableName: 'users',
})
export default class User extends Model<UserAttributes> implements UserAttributes {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id',
  })
  id!: number;

  @Column({
    type: DataType.STRING(255),
    field: 'email',
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Email is required' },
      isEmail: { msg: 'Email is invalid' },
    },
  })
  email!: string;

  @Column({
    type: DataType.STRING(255),
    field: 'password',
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Password is required' },
      len: { args: [6, 50], msg: 'Password must be between 6 and 50 characters' },
    },
  })
  password!: string;

  @Column({
    type: DataType.ENUM('user', 'admin'),
    field: 'role',
    allowNull: false,
    defaultValue: 'user',
    validate: {
      isIn: {
        args: [['user', 'admin']],
        msg: 'Role must be user or admin',
      },
    },
  })
  role!: Role;
}
