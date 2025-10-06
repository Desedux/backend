import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

@Controller('card')
export class CardController {
  @Get()
  getAllCards() {
    return 'This action returns all cards';
  }

  @Get('detail/:id')
  getCardById(@Param('id') cardId: string) {
    return `This action returns a card by ${cardId}`;
  }

  @Post()
  createCard() {
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
