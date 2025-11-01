import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TagModel } from './tags.model';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { CardModule } from '../card/card.module';

@Module({
  imports: [
    SequelizeModule.forFeature([TagModel]),
    forwardRef(() => CardModule),
  ],
  providers: [TagsService],
  controllers: [TagsController],
  exports: [TagsService],
})
export class TagsModule {}
