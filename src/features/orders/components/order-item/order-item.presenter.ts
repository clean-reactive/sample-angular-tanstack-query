import { computed, inject, Injectable, type Signal } from '@angular/core';
import { injectMutationState } from '@tanstack/angular-query-experimental';
import { deleteOrderItemMutationKey } from '../../repository';
import type { ItemEntityId, OrderEntityId } from '../../repository';
import { IsDeleteOrderMutatingSelector, ItemByIdSelector } from '../../selectors';
import { createContext, injectContext } from '../../../../utils';
import type { Presenter } from './order-item.types';

export const orderItemPresenterContext = createContext<{
  orderId: Signal<OrderEntityId>;
  itemId: Signal<ItemEntityId>;
}>();

const DEFAULT_PRODUCT_ID = '';
const DEFAULT_QUANTITY = 0;

@Injectable()
export class OrderItemPresenter implements Presenter {
  private readonly context = injectContext(orderItemPresenterContext);
  private readonly itemByIdSelector = inject(ItemByIdSelector);
  private readonly isDeleteOrderMutatingSelector = inject(IsDeleteOrderMutatingSelector);
  private readonly _deleteOrderItemPendingMutations = injectMutationState(() => ({
    filters: { mutationKey: deleteOrderItemMutationKey, status: 'pending' },
    select: (mutation) => {
      const vars = mutation.state.variables as { orderId: OrderEntityId; itemId: ItemEntityId };
      return vars.orderId === this.context.orderId() && vars.itemId === this.context.itemId();
    },
  }));
  private readonly _isDeleteItemButtonDisabled = computed(
    () =>
      this._deleteOrderItemPendingMutations().includes(true) ||
      this.isDeleteOrderMutatingSelector.result(),
  );

  get hasItem(): boolean {
    return this.itemByIdSelector.result() !== undefined;
  }
  get itemId(): ItemEntityId {
    return this.context.itemId();
  }
  get productId(): string {
    return this.itemByIdSelector.result()?.productId ?? DEFAULT_PRODUCT_ID;
  }
  get productQuantity(): number {
    return this.itemByIdSelector.result()?.quantity ?? DEFAULT_QUANTITY;
  }
  get isDeleteItemButtonDisabled(): boolean {
    return this._isDeleteItemButtonDisabled();
  }
}
