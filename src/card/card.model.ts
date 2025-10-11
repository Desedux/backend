import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { InferAttributes, InferCreationAttributes } from 'sequelize';

@Table({
    tableName: 'card',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
})
export class CalendarModel extends Model<
  InferAttributes<CalendarModel>,
  InferCreationAttributes<CalendarModel>
> {
    
}