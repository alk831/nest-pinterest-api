import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  NotFoundException,
  UseGuards
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { PinterestService } from '../pinterest/pinterest.service';
import { PinterestPin } from 'src/pinterest/interfaces/pinterest.interface';
import { UserData } from '../common/decorators';
import { User } from '../models';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';

@Controller('cards')
@UseGuards(AuthenticatedGuard)
export class CardsController {
  constructor(
    private readonly cardsService: CardsService,
    private readonly pinterestService: PinterestService
  ) {}

  private readonly pinterestUser = 'usemuzli';

  @Get('popular')
  getPopularCards(
    @Query() query: { cursor?: string }
  ) {
    return this.pinterestService.getPinsForBoard(
      this.pinterestUser,
      'mobile-interactions-design-inspiration',
      query.cursor
    );
  }

  @Get('favorite')
  getFavoriteCards(
    @UserData() user: User
  ) {
    return this.cardsService.getFavorite(user.id);
  }

  @Post('favorite')
  async saveCardAsFavorite(
    @Body() body: PinterestPin,
    @UserData() user: User
  ) {
    const likedCard = await this.cardsService.addFavorite(body, user.id);
    return likedCard;
  }

  @Delete('favorite/:id')
  async removeCardFromFavorite(
    @Param('id') id: string,
    @UserData() user: User
  ) {
    const hasBeenRemoved = await this.cardsService.removeFavorite(id, user.id);
    if (!hasBeenRemoved) {
      throw new NotFoundException(
        `Card with id of ${id} is not saved as your favorite, or does not exists.`
      );
    }
  }

}