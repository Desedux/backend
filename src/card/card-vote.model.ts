import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { CardModel } from './card.model';
import { InferAttributes, InferCreationAttributes } from 'sequelize';

@Table({
  tableName: 'card_vote',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class CardVoteModel extends Model<
  InferAttributes<CardVoteModel>,
  InferCreationAttributes<CardVoteModel>
> {
  @ForeignKey(() => CardModel)
  @Column({ type: DataType.INTEGER, primaryKey: true })
  declare card_id: number;

  @Column({ type: DataType.STRING, primaryKey: true })
  declare user_id: string;

  @Column({ type: DataType.SMALLINT })
  declare vote: number;
}
