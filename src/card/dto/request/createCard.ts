import {
  IsArray,
  ArrayNotEmpty,
  ArrayMinSize,
  IsNumber,
  IsBoolean,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCardDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1024)
  description: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @Type(() => Number)
  @IsNumber({}, { each: true })
  tags: number[];

  @IsBoolean()
  @IsNotEmpty()
  isAnonymous: boolean;
}
