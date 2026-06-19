import { factoryT, fields } from 'factory-t';
import { randomFrom1To100 } from '../../../../../../utils/testing';
import type {
  ItemEntity,
  ItemEntityId,
  OrderEntity,
  OrderEntityId,
} from '../../orders.repository.types';

export const itemEntityFactory = factoryT<ItemEntity>({
  id: (ctx) => `${ctx.index}` as ItemEntityId,
  productId: fields.sequence(
    randomFrom1To100.slice(randomFrom1To100.length / 2).map((v) => v.toString()),
  ),
  quantity: fields.sequence(randomFrom1To100),
});

export const orderEntityFactory = factoryT<OrderEntity>({
  id: (ctx) => `${ctx.index}` as OrderEntityId,
  userId: fields.sequence(randomFrom1To100.map((n) => n.toString())),
  itemEntities: [],
});

export function makeOrderEntities(ordersCount = 5, itemsCount = 7): OrderEntity[] {
  const orders: OrderEntity[] = [];
  for (let i = 0; i < ordersCount; i++) {
    orders.push(
      orderEntityFactory.item({
        itemEntities: itemEntityFactory.list({
          count: itemsCount,
        }),
      }),
    );
  }
  return orders;
}
