import { inject, Injectable, type Signal } from '@angular/core';
import { DeleteOrderItemUseCase } from '../../use-cases';
import type { ItemEntityId, OrderEntityId } from '../../repository';
import { createContext, injectContext } from '../../../../utils';
import type { Controller } from './order-item.types';

export const orderItemControllerContext = createContext<{
  orderId: Signal<OrderEntityId>;
  itemId: Signal<ItemEntityId>;
}>();

@Injectable()
export class OrderItemController implements Controller {
  private readonly useCase = inject(DeleteOrderItemUseCase);
  private readonly context = injectContext(orderItemControllerContext);

  deleteOrderItemButtonClicked(): void {
    void this.useCase.execute(this.context.orderId(), this.context.itemId());
  }
}
