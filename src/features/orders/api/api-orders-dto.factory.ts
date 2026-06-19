import { factoryT, fields } from 'factory-t';
import { randomFrom1To100 } from '../../../utils/testing';
import type { ApiOrderDto, ApiOrderItemDto } from './types';

export const apiOrderItemDtoFactory = factoryT<ApiOrderItemDto>({
  id: (ctx) => `${ctx.index}`,
  productId: fields.sequence(
    randomFrom1To100.slice(randomFrom1To100.length / 2).map((v) => v.toString()),
  ),
  quantity: fields.sequence(randomFrom1To100),
});

export const apiOrderDtoFactory = factoryT<ApiOrderDto>({
  id: (ctx) => `${ctx.index}`,
  userId: fields.sequence(randomFrom1To100.map((n) => n.toString())),
  items: () =>
    apiOrderItemDtoFactory.list({
      count: 3,
    }),
});
