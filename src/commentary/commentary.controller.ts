import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
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
import { VoteCommentaryDto } from './dto/request/reaction.dto';
import { UserUid } from '../decorator/user-uid.decorator';
import { CommentResponseDto } from './dto/request/comment.response.dto';
import { PaginatedCommentsResponse } from './dto/response/PaginatedCommentsResponse';
import { CommentaryModel } from './commentary.model';

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
    @UserUid() userUid?: string,
  ) {
    const pageNumber = Number(page) || 1;
    const itemsPerPage = Math.min(Number(limit) || 20, 100);
    const parentCommentId = parentId ? Number(parentId) : undefined;

    return await this.commentaryService.list(
      cardId,
      {
        parentCommentId,
        pageNumber,
        itemsPerPage,
      },
      userUid,
    );
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

  @Patch()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Votar em um card (up/down)' })
  @ApiBody({
    examples: {},
    description: 'ID do card',
  })
  @ApiBody({
    type: VoteCommentaryDto,
    examples: {
      upvote: { value: { isUpvote: true, cardId: '1', commentaryId: null } },
    },
  })
  @ApiNoContentResponse({ description: 'Voto registrado.' })
  @ApiNotFoundResponse({
    description: 'Card não encontrado.',
    schema: { example: { statusCode: 404, message: 'Card not found' } },
  })
  @ApiForbiddenResponse({
    description: 'Não autenticado.',
    schema: { example: { statusCode: 403, message: 'Forbidden Access' } },
  })
  @ApiConflictResponse({
    description: 'Voto já registrado da mesma forma.',
    schema: { example: { statusCode: 409, message: 'Vote already recorded' } },
  })
  async voteCard(
    @Body() dto: VoteCommentaryDto,
    @UserUid() userUid: string,
  ): Promise<CommentaryModel> {
    return await this.commentaryService.vote(
      dto.cardId,
      dto.commentaryId,
      dto.isUpvote,
      userUid,
    );
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Delete(':cardId/:commentId')
  @ApiNoContentResponse({ description: 'Comentário desativado.' })
  async delete(
    @Param('cardId', ParseIntPipe) cardId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @UserUid() userUid: string,
  ): Promise<CommentaryModel> {
    return await this.commentaryService.delete(cardId, commentId, userUid);
  }
}
