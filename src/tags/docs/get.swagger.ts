import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { TagResponseDto } from '../dto/response/TagResponseDto';

export function SwaggerGetTags() {
  return applyDecorators(
    ApiOperation({
      summary: 'Listar tags',
      description: 'Retorna todas as tags ativas cadastradas.',
    }),
    ApiOkResponse({ type: TagResponseDto, isArray: true }),
  );
}
