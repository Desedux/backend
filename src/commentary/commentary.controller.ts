import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommentaryService } from './commentary.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateCommentDto } from './dto/request/create-comment.dto';
import { UpdateCommentDto } from './dto/request/update-comment.dto';
import { ReactionDto } from './dto/request/reaction.dto';
import { UserUid } from '../decorator/user-uid.decorator';
import { CommentResponseDto } from './dto/request/comment.response.dto';
import { PaginatedCommentsResponse } from './dto/response/PaginatedCommentsResponse';
import { DeleteResponseDto } from './dto/response/DeleteResponseDto';
import { ReactionResponseDto } from './dto/response/ReactionResponseDto';

@ApiTags('commentary')
@Controller('commentary')
export class CommentaryController {
  constructor(private readonly commentaryService: CommentaryService) {}

  @Get(':cardId')
  @ApiOperation({
    summary: 'Listar comentários de um card (raiz ou respostas)',
  })
  @ApiParam({
    name: 'cardId',
    type: Number,
    example: 1,
    description: 'ID do card',
  })
  @ApiQuery({
    name: 'parentId',
    required: false,
    type: Number,
    example: 10,
    description:
      'ID do comentário pai para listar respostas (omita para listar comentários de nível raiz)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Número da página (default 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 20,
    description: 'Itens por página (máx. 100; default 20)',
  })
  @ApiOkResponse({
    description: 'Lista paginada de comentários',
    type: PaginatedCommentsResponse,
  })
  @ApiNotFoundResponse({
    description: 'Card não encontrado.',
    schema: { example: { statusCode: 404, message: 'Card not found' } },
  })
  async list(
    @Param('cardId', ParseIntPipe) cardId: number,
    @Query('parentId') parentId?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    const pageNumber = Number(page) || 1;
    const itemsPerPage = Math.min(Number(limit) || 20, 100);
    const parentCommentId = parentId ? Number(parentId) : undefined;

    return await this.commentaryService.list(cardId, {
      parentCommentId,
      pageNumber,
      itemsPerPage,
    });
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post(':cardId')
  @ApiOperation({
    summary: 'Criar comentário (top-level ou reply se parentId no body)',
  })
  @ApiParam({
    name: 'cardId',
    type: Number,
    example: 1,
    description: 'ID do card',
  })
  @ApiBody({
    description:
      'Conteúdo do comentário. Envie parentId para responder a um comentário.',
    type: CreateCommentDto,
  })
  @ApiCreatedResponse({
    description: 'Comentário criado com sucesso.',
    type: CommentResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos ou parentId não pertence ao card.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Parent comment not found for this card',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Usuário não autenticado.',
    schema: { example: { statusCode: 401, message: 'Unauthorized' } },
  })
  @ApiNotFoundResponse({
    description: 'Card ou usuário não encontrado.',
    schema: { example: { statusCode: 404, message: 'Card not found' } },
  })
  async create(
    @Param('cardId', ParseIntPipe) cardId: number,
    @Body() dto: CreateCommentDto,
    @UserUid() userUid: string,
  ) {
    return this.commentaryService.create(cardId, dto, userUid);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Patch(':cardId/:commentId')
  @ApiOperation({ summary: 'Editar comentário (somente autor)' })
  @ApiParam({
    name: 'cardId',
    type: Number,
    example: 1,
    description: 'ID do card',
  })
  @ApiParam({
    name: 'commentId',
    type: Number,
    example: 10,
    description: 'ID do comentário',
  })
  @ApiBody({
    description: 'Novo conteúdo do comentário',
    type: UpdateCommentDto,
  })
  @ApiOkResponse({
    description: 'Comentário atualizado.',
    type: CommentResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Usuário não autenticado.',
    schema: { example: { statusCode: 401, message: 'Unauthorized' } },
  })
  @ApiForbiddenResponse({
    description: 'Edição não permitida (não é o autor).',
    schema: {
      example: { statusCode: 403, message: 'You cannot edit this comment' },
    },
  })
  @ApiNotFoundResponse({
    description: 'Card ou comentário não encontrado.',
    schema: { example: { statusCode: 404, message: 'Comment not found' } },
  })
  async update(
    @Param('cardId', ParseIntPipe) cardId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() dto: UpdateCommentDto,
    @UserUid() userUid: string,
  ) {
    return this.commentaryService.update(cardId, commentId, dto, userUid);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Delete(':cardId/:commentId')
  @ApiOperation({ summary: 'Remover comentário (somente autor)' })
  @ApiParam({
    name: 'cardId',
    type: Number,
    example: 1,
    description: 'ID do card',
  })
  @ApiParam({
    name: 'commentId',
    type: Number,
    example: 10,
    description: 'ID do comentário',
  })
  @ApiOkResponse({
    description: 'Comentário removido.',
    type: DeleteResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Usuário não autenticado.',
    schema: { example: { statusCode: 401, message: 'Unauthorized' } },
  })
  @ApiForbiddenResponse({
    description: 'Remoção não permitida (não é o autor).',
    schema: {
      example: { statusCode: 403, message: 'You cannot delete this comment' },
    },
  })
  @ApiNotFoundResponse({
    description: 'Card ou comentário não encontrado.',
    schema: { example: { statusCode: 404, message: 'Comment not found' } },
  })
  async remove(
    @Param('cardId', ParseIntPipe) cardId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @UserUid() userUid: string,
  ) {
    return this.commentaryService.remove(cardId, commentId, userUid);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Patch(':cardId/:commentId/reaction')
  @ApiOperation({
    summary: 'Definir minha reação ao comentário (like/dislike/none)',
  })
  @ApiParam({
    name: 'cardId',
    type: Number,
    example: 1,
    description: 'ID do card',
  })
  @ApiParam({
    name: 'commentId',
    type: Number,
    example: 10,
    description: 'ID do comentário',
  })
  @ApiBody({
    description: 'Ação de reação do usuário',
    type: ReactionDto,
  })
  @ApiOkResponse({
    description:
      'Reação aplicada. Retorna up_down atualizado e sua reação atual.',
    type: ReactionResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Reação inválida.',
    schema: { example: { statusCode: 400, message: 'Invalid reaction' } },
  })
  @ApiUnauthorizedResponse({
    description: 'Usuário não autenticado.',
    schema: { example: { statusCode: 401, message: 'Unauthorized' } },
  })
  @ApiNotFoundResponse({
    description: 'Card ou comentário não encontrado.',
    schema: { example: { statusCode: 404, message: 'Comment not found' } },
  })
  async setReaction(
    @Param('cardId', ParseIntPipe) cardId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() dto: ReactionDto,
    @UserUid() userUid: string,
  ) {
    return this.commentaryService.setReaction(
      cardId,
      commentId,
      dto.action,
      userUid,
    );
  }
}
