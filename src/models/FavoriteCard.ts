import {
  Model, Table, Column, PrimaryKey, BelongsTo, ForeignKey
} from 'sequelize-typescript';
import { Card } from './Card';
import { User } from './User';

@Table({
  tableName: 'favorite_cards'
})
export class FavoriteCard extends Model<FavoriteCard> {

  @PrimaryKey
  id: number

  @ForeignKey(() => Card)
  @Column
  cardId: number
  
  @ForeignKey(() => User)
  @Column
  userId: number

  
  @BelongsTo(() => Card)
  card: Card

  @BelongsTo(() => User)
  user: User
  
}