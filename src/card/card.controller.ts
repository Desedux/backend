import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/request/createCard';
import { UserUid } from '../decorator/user-uid.decorator';
import { CardModel } from './card.model';
import { VoteDto } from './dto/request/updateCard';
import { SwaggerDetailCard } from './docs/details.swagger';
import { SwaggerListAllCards } from './docs/get-all.swagger';
import { SwaggerGetByCategory } from './docs/get-category.swagger';
import { SwaggerCreateCard } from './docs/create.swagger';
import { SwaggerCardVote } from './docs/vote.swagger';
import { SwaggerDeleteCard } from './docs/delete.swagger';

@ApiBearerAuth()
@ApiTags('card')
@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Get()
  @SwaggerListAllCards()
  async getAllCards(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @UserUid() userUid: string,
  ): Promise<CardModel[]> {
    return this.cardService.getCards(page, undefined, userUid);
  }

  @Get('detail/:id')
  @SwaggerDetailCard()
  async getCardById(
    @Param('id') cardId: string,
    @UserUid() userUid: string,
  ): Promise<CardModel> {
    return await this.cardService.getCardById(cardId, userUid);
  }

  @Get('tag/:category')
  @SwaggerGetByCategory()
  async getCardsByCategory(
    @Param('category') category: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @UserUid() userUid: string,
  ): Promise<CardModel[]> {
    return this.cardService.getCards(page, category, userUid);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @SwaggerCreateCard()
  async createCard(
    @Body() createCardDto: CreateCardDto,
    @UserUid() userUid: string,
  ): Promise<CardModel> {
    return await this.cardService.createCard(createCardDto, userUid);
  }

  @Patch()
  @SwaggerCardVote()
  async voteCard(
    @Body() dto: VoteDto,
    @UserUid() userUid: string,
  ): Promise<CardModel> {
    return await this.cardService.vote(dto.cardId, dto.isUpvote, userUid);
  }

  @Delete(':id')
  @SwaggerDeleteCard()
  async deleteCard(@Param('id') cardId: string, @UserUid() userUid: string) {
    await this.cardService.deleteCard(cardId, userUid);
    return {};
  }
}
