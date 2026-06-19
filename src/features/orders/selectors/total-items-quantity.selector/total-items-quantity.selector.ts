import { computed, inject, Injectable, type Signal } from '@angular/core';
import { OrdersSelector } from '../orders.selector';
import type { Selector } from '../../../../@types';

@Injectable()
export class TotalItemsQuantitySelector implements Selector<Signal<number>> {
  private readonly ordersSelector = inject(OrdersSelector);

  readonly result = computed(() =>
    this.ordersSelector
      .result()
      .reduce(
        (acc, entity) =>
          acc + entity.itemEntities.reduce((itemAcc, item) => itemAcc + item.quantity, 0),
        0,
      ),
  );
}
