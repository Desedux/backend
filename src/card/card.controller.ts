import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
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
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/request/createCard';
import { AuthGuard } from '../auth/auth.guard';
import { UserUid } from '../decorator/user-uid.decorator';
import { CardModel } from './card.model';
import { VoteDto } from './dto/request/updateCard';
@ApiBearerAuth()
@ApiTags('card')
@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Get()
  @ApiOperation({ summary: 'Listar cards paginados' })
  @ApiParam({
    name: 'page',
    type: Number,
    example: 1,
    description: 'Número da página (20 itens por página)',
  })
  @ApiOkResponse({
    description: 'Lista retornada com sucesso.',
    type: CardModel,
    isArray: true,
  })
  async getAllCards(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @UserUid() userUid: string,
  ): Promise<CardModel[]> {
    return this.cardService.getCards(page, undefined, userUid);
  }

  @Get('detail/:id')
  @ApiOperation({ summary: 'Obter um card pelo ID' })
  @ApiParam({
    name: 'id',
    type: String,
    example: '1',
    description: 'ID do card',
  })
  @ApiOkResponse({
    description: 'Card encontrado.',
    type: CardModel,
  })
  @ApiNotFoundResponse({
    description: 'Card não encontrado.',
    schema: {
      example: { statusCode: 404, message: 'Card not found' },
    },
  })
  async getCardById(
    @Param('id') cardId: string,
    @UserUid() userUid: string,
  ): Promise<CardModel> {
    return await this.cardService.getCardById(cardId, userUid);
  }

  @Get('tag/:category')
  @ApiOperation({ summary: 'Listar cards por categoria paginados' })
  @ApiParam({
    name: 'category',
    type: Number,
    example: 1,
    description: 'Categoria (tag) do card',
  })
  @ApiParam({
    name: 'page',
    type: Number,
    example: 1,
    description: 'Número da página (20 itens por página)',
  })
  @ApiOkResponse({
    description: 'Lista retornada com sucesso.',
    type: CardModel,
    isArray: true,
  })
  async getCardsByCategory(
    @Param('category') category: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @UserUid() userUid: string,
  ): Promise<CardModel[]> {
    return this.cardService.getCards(page, category, userUid);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Criar um novo card' })
  @ApiBody({
    type: CreateCardDto,
    examples: {
      default: {
        summary: 'Exemplo',
        value: {
          title: 'Sugestão de melhoria',
          description: 'Adicionar modo offline no app',
          isAnonymous: false,
          tags: [1, 2],
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Card criado com sucesso.',
    schema: { example: 'This action adds a new card' },
  })
  @ApiBadRequestResponse({
    description: 'Tags inválidas/ausentes.',
    schema: { example: { statusCode: 400, message: 'Tags not found' } },
  })
  @ApiNotFoundResponse({
    description: 'Usuário não encontrado.',
    schema: { example: { statusCode: 404, message: 'User not found' } },
  })
  @ApiUnauthorizedResponse({
    description: 'Não autenticado.',
    schema: { example: { statusCode: 401, message: 'Unauthorized' } },
  })
  async createCard(
    @Body() createCardDto: CreateCardDto,
    @UserUid() userUid: string,
  ): Promise<CardModel> {
    return await this.cardService.createCard(createCardDto, userUid);
  }

  @Patch()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Votar em um card (up/down)' })
  @ApiBody({
    examples: {},
    description: 'ID do card',
  })
  @ApiBody({
    type: VoteDto,
    examples: {
      upvote: { value: { isUpvote: true, cardId: '1' } },
      downvote: { value: { isUpvote: false, cardId: '1' } },
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
    description: 'Usuário já votou da mesma forma anteriormente.',
    schema: { example: { statusCode: 409, message: 'Conflict' } },
  })
  async voteCard(
    @Body() dto: VoteDto,
    @UserUid() userUid: string,
  ): Promise<CardModel> {
    return await this.cardService.vote(dto.cardId, dto.isUpvote, userUid);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Excluir (desativar) um card' })
  @ApiParam({
    name: 'id',
    type: String,
    example: '1',
    description: 'ID do card',
  })
  @ApiOkResponse({
    description: 'Card excluído (soft delete).',
    schema: { example: 'This action deletes a card' },
  })
  @ApiForbiddenResponse({
    description: 'Usuário não é o autor do card.',
    schema: { example: { statusCode: 403, message: 'Forbidden' } },
  })
  @ApiNotFoundResponse({
    description: 'Card não encontrado.',
    schema: { example: { statusCode: 404, message: 'Card not found' } },
  })
  @ApiUnauthorizedResponse({
    description: 'Não autenticado.',
    schema: { example: { statusCode: 401, message: 'Unauthorized' } },
  })
  async deleteCard(@Param('id') cardId: string, @UserUid() userUid: string) {
    await this.cardService.deleteCard(cardId, userUid);
    return {};
  }
}
