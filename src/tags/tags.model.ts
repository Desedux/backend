import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { CardModel } from '../card/card.model';
import { CardTagModel } from '../card/card-tag.model';

@Table({
  tableName: 'tag',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class TagModel extends Model<
  InferAttributes<TagModel>,
  InferCreationAttributes<TagModel>
> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING(80),
    allowNull: false,
    unique: true,
  })
  declare name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare image_url: string | null;

  @BelongsToMany(() => CardModel, () => CardTagModel)
  declare cards: CardModel[];
}
