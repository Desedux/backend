import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { CardModel } from '../card/card.model';
import { CardVoteModel } from '../card/card-vote.model';

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
  })
  declare uid: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare role: string;

  @HasMany(() => CardModel, { foreignKey: 'user_id', sourceKey: 'uid' })
  declare cards?: CardModel[];

  @BelongsToMany(() => CardModel, () => CardVoteModel)
  declare votedCards?: CardModel[];
}
