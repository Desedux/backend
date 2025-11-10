import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  BelongsToMany,
  ForeignKey,
} from 'sequelize-typescript';
import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { CardTagModel } from './card-tag.model';
import { TagModel } from '../tags/tags.model';
import { CardVoteModel } from './card-vote.model';
import { UserModel } from '../user/user.model';

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
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare id?: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare title: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare description: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare author: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare up_down: number;

  @ForeignKey(() => UserModel)
  @Column({ type: DataType.STRING, allowNull: false })
  declare user_id: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  declare deactivated: boolean;

  @BelongsTo(() => UserModel)
  declare user?: UserModel;

  @BelongsToMany(() => TagModel, () => CardTagModel)
  declare tags?: TagModel[];

  @BelongsToMany(() => UserModel, () => CardVoteModel)
  declare voters?: UserModel[];
}
