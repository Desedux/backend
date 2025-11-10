// card-vote.model.ts
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { CardModel } from './card.model';
import { UserModel } from '../user/user.model';

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

  @ForeignKey(() => UserModel)
  @Column({ type: DataType.STRING, primaryKey: true })
  declare user_id: string;

  @Column({ type: DataType.SMALLINT, allowNull: false })
  declare vote: number;

  @BelongsTo(() => CardModel)
  declare card?: CardModel;

  @BelongsTo(() => UserModel)
  declare user?: UserModel;
}
