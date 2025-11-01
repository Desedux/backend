import { Controller, Get } from '@nestjs/common';
import { TagModel } from './tags.model';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagService: TagsService) {}
  @Get()
  async getAllTags(): Promise<TagModel[]> {
    return await this.tagService.getAllTags();
  }
}
