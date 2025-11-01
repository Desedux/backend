import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { TagModel } from './tags.model';

@Module({
  imports: [SequelizeModule.forFeature([TagModel])],
  providers: [TagsService],
  controllers: [TagsController],
})
export class TagsModule {}
