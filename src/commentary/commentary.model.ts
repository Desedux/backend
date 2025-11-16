import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from 'sequelize';
import { CardModel } from '../card/card.model';

@Table({
  tableName: 'comment',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class CommentaryModel extends Model<
  InferAttributes<CommentaryModel>,
  InferCreationAttributes<CommentaryModel>
> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare id: CreationOptional<number>;

  @ForeignKey(() => CardModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare card_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare user_uid: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare author: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare content: string;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  declare up_down: CreationOptional<number>;

  @ForeignKey(() => CommentaryModel)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare parent_id: CreationOptional<number | null>;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  declare deactivate: CreationOptional<boolean>;

  @BelongsTo(() => CardModel)
  declare card?: NonAttribute<CardModel>;

  @BelongsTo(() => CommentaryModel, 'parent_id')
  declare parent?: NonAttribute<CommentaryModel>;

  @HasMany(() => CommentaryModel, 'parent_id')
  declare replies?: NonAttribute<CommentaryModel[]>;
}
