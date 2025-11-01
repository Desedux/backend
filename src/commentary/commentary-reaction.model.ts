import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { CommentaryModel } from './commentary.model';

@Table({
  tableName: 'comment_reaction',
  timestamps: false,
})
export class CommentaryReactionModel extends Model {
  @ForeignKey(() => CommentaryModel)
  @Column({ type: DataType.INTEGER, primaryKey: true })
  declare comment_id: number;

  @Column({ type: DataType.STRING, primaryKey: true })
  declare user_uid: string;

  @Column({ type: DataType.ENUM('like', 'dislike'), allowNull: true })
  declare action: 'like' | 'dislike' | null;

  @BelongsTo(() => CommentaryModel)
  declare comment: CommentaryModel;
}
