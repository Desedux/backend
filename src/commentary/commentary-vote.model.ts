import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { UserModel } from '../user/user.model';
import { CommentaryModel } from './commentary.model';

@Table({
  tableName: 'comment_vote',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class CommentVoteModel extends Model<
  InferAttributes<CommentVoteModel>,
  InferCreationAttributes<CommentVoteModel>
> {
  @ForeignKey(() => CommentaryModel)
  @Column({ type: DataType.INTEGER, primaryKey: true })
  declare comment_id: number;

  @ForeignKey(() => UserModel)
  @Column({ type: DataType.STRING, primaryKey: true })
  declare user_id: string;

  @Column({ type: DataType.SMALLINT, allowNull: false })
  declare vote: number;

  @BelongsTo(() => CommentaryModel)
  declare comment?: CommentaryModel;
}
