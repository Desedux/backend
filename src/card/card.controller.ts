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

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}
  @Get()
  getAllCards() {
    return 'This action returns all cards';
  }

  @Get('detail/:id')
  getCardById(@Param('id') cardId: string) {
    return `This action returns a card by ${cardId}`;
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
  updateCard(@Param('id') cardId: string) {
    return 'This action updates a card';
  }

  @Delete(':id')
  deleteCard(@Param('id') cardId: string) {
    return 'This action deletes a card';
  }
}
