import { inject, Injectable, type Signal } from '@angular/core';
import { OrdersRepository } from '../../repository';
import type { OrderEntityId } from '../../repository';
import { createContext, injectContext } from '../../../../utils';
import type { Controller } from './order.types';

export const orderControllerContext = createContext<{ orderId: Signal<OrderEntityId> }>();

@Injectable()
export class OrderController implements Controller {
  private readonly repository = inject(OrdersRepository);
  private readonly context = injectContext(orderControllerContext);

  deleteOrderButtonClicked(): void {
    void this.deleteOrderUseCase(this.context.orderId());
  }

  private async deleteOrderUseCase(orderId: OrderEntityId): Promise<void> {
    try {
      await this.repository.deleteOrder.mutateAsync({ orderId });
    } catch (err) {
      console.error('OrderController.deleteOrder', err);
    }
  }
}
