import { computed, inject, Injectable } from '@angular/core';
import { OrdersRepository } from '../../repository';
import { OrderIdsSelector } from '../../selectors';
import type { Presenter } from './orders.types';

@Injectable()
export class OrdersPresenter implements Presenter {
  private readonly repository = inject(OrdersRepository);
  private readonly orderIdsSelector = inject(OrderIdsSelector);

  private readonly _isLoading = computed(() => this.repository.getOrders.isLoading());
  private readonly _isFetching = computed(() => this.repository.getOrders.isFetching());
  private readonly _isMutating = computed(
    () => this.repository.deleteOrder.isPending() || this.repository.deleteOrderItem.isPending(),
  );

  get orderIds() {
    return this.orderIdsSelector.result();
  }
  get isProcessing() {
    return this._isLoading() || this._isFetching() || this._isMutating();
  }
  get statusLabel() {
    if (this._isLoading()) {
      return 'loading';
    }
    if (this._isFetching()) {
      return 'fetching';
    }
    if (this._isMutating()) {
      return 'mutating';
    }
    return 'idle';
  }
}
