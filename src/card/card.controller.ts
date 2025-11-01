import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/request/createCard';
import { AuthGuard } from '../auth/auth.guard';
import { UserUid } from '../decorator/user-uid.decorator';
import { CardModel } from './card.model';
import { VoteDto } from './dto/request/updateCard';

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}
  @Get(':page')
  getAllCards(@Param('page') page: number): Promise<CardModel[]> {
    return this.cardService.getCards(page);
  }

  @Get('detail/:id')
  async getCardById(@Param('id') cardId: string): Promise<CardModel> {
    return await this.cardService.getCardById(cardId);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createCard(
    @Body() createCardDto: CreateCardDto,
    @UserUid() userUid: string,
  ) {
    await this.cardService.createCard(createCardDto, userUid);
    return 'This action adds a new card';
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async voteCard(@Param('id') cardId: string, @Body() dto: VoteDto) {
    await this.cardService.vote(cardId, dto.isUpvote);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteCard(@Param('id') cardId: string, @UserUid() userUid: string) {
    await this.cardService.deleteCard(cardId, userUid);
    return 'This action deletes a card';
  }
}
