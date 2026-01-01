import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TagsService } from './tags.service';
import { TagResponseDto } from './dto/response/TagResponseDto';
import { SwaggerGetTags } from './docs/get.swagger';

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagService: TagsService) {}

  @Get()
  @SwaggerGetTags()
  async getAllTags(): Promise<TagResponseDto[]> {
    return await this.tagService.getAllTags();
  }
}
