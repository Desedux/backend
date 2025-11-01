import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { CardTagModel } from './card-tag.model';
import { TagModel } from '../tags/tags.model';

@Table({
  tableName: 'card',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class CardModel extends Model<
  InferAttributes<CardModel>,
  InferCreationAttributes<CardModel>
> {
  @Column({ type: DataType.STRING, allowNull: false })
  declare title: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare description: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare author: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare up_down: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare user_id: string;

  @BelongsToMany(() => TagModel, () => CardTagModel)
  declare tags?: TagModel[];
}
