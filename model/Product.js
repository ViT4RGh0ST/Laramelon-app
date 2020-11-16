import { Model } from '@nozbe/watermelondb'
import { date, field, readonly, text } from '@nozbe/watermelondb/decorators'

export default class Product extends Model {
  static table = 'products'

  @readonly @field('id') id
  @field('name') name
  @field('price') price
  @readonly @date('created_at') createdAt
  @readonly @date('updated_at') updatedAt
  @readonly @date('deleted_at') deletedAt
}