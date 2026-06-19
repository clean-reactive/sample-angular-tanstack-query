import { computed, inject, Injectable, type Signal } from '@angular/core';
import { OrdersSelector } from '../orders.selector';
import type { OrderEntity, OrderEntityId } from '../../repository';
import type { Selector } from '../../../../@types';
import { createContext, injectContext } from '../../../../utils';

export const orderByIdSelectorContext = createContext<{ orderId: Signal<OrderEntityId> }>();

@Injectable()
export class OrderByIdSelector implements Selector<Signal<OrderEntity | undefined>> {
  private readonly ordersSelector = inject(OrdersSelector);
  private readonly context = injectContext(orderByIdSelectorContext);

  readonly result = computed(() =>
    this.ordersSelector.result().find((o) => o.id === this.context.orderId()),
  );
}
