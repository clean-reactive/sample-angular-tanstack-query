import { computed, inject, Injectable, type Signal } from '@angular/core';
import { OrdersSelector } from '../orders.selector';
import type { ItemEntity, ItemEntityId, OrderEntityId } from '../../repository';
import type { Selector } from '../../../../@types';
import { createContext, injectContext } from '../../../../utils';

export const itemByIdSelectorContext = createContext<{
  orderId: Signal<OrderEntityId>;
  itemId: Signal<ItemEntityId>;
}>();

@Injectable()
export class ItemByIdSelector implements Selector<Signal<ItemEntity | undefined>> {
  private readonly ordersSelector = inject(OrdersSelector);
  private readonly context = injectContext(itemByIdSelectorContext);

  readonly result = computed(() => {
    const order = this.ordersSelector.result().find((o) => o.id === this.context.orderId());
    return order?.itemEntities.find((item) => item.id === this.context.itemId());
  });
}
