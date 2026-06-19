import { computed, inject, Injectable, type Signal } from '@angular/core';
import { OrdersSelector } from '../orders.selector';
import type { OrderEntityId } from '../../repository';
import type { Selector } from '../../../../@types';

@Injectable()
export class OrderIdsSelector implements Selector<Signal<OrderEntityId[]>> {
  private readonly ordersSelector = inject(OrdersSelector);

  readonly result = computed(() => this.ordersSelector.result().map((order) => order.id));
}
