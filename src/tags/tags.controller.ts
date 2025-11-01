import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TagModel } from './tags.model';
import { TagsService } from './tags.service';
import { TagResponseDto } from './dto/response/TagResponseDto';

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagService: TagsService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar tags',
    description: 'Retorna todas as tags ativas cadastradas.',
  })
  @ApiOkResponse({ type: TagResponseDto, isArray: true })
  async getAllTags(): Promise<TagModel[]> {
    return await this.tagService.getAllTags();
  }
}
