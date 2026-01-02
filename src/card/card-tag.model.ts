import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
  BelongsTo,
} from 'sequelize-typescript';
import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { CardModel } from './card.model';
import { TagModel } from '../tags/tags.model';

@Table({
  tableName: 'card_tags',
  timestamps: false,
})
export class CardTagModel extends Model<
  InferAttributes<CardTagModel>,
  InferCreationAttributes<CardTagModel>
> {
  @ForeignKey(() => CardModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare card_id: number;

  @ForeignKey(() => TagModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare tag_id: number;

  @BelongsTo(() => CardModel)
  declare card?: CardModel;

  @BelongsTo(() => TagModel)
  declare tag?: TagModel;
}
