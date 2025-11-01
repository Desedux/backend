import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { InferAttributes, InferCreationAttributes } from 'sequelize';

@Table({
  tableName: 'user',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class UserModel extends Model<
  InferAttributes<UserModel>,
  InferCreationAttributes<UserModel>
> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    allowNull: false,
    comment: 'UID do usuário no Firebase',
  })
  declare uid: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    comment: 'Função do usuário (ex: admin, user, moderator)',
  })
  declare role: string;
}
