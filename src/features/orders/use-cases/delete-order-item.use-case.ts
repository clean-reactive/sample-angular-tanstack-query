import { inject, Injectable } from '@angular/core';
import { OrdersRepository } from '../repository';
import { OrdersSelector } from '../selectors';
import type { ItemEntityId, OrderEntityId } from '../repository';

@Injectable()
export class DeleteOrderItemUseCase {
  private readonly repository = inject(OrdersRepository);
  private readonly ordersSelector = inject(OrdersSelector);

  async execute(orderId: OrderEntityId, itemId: ItemEntityId): Promise<void> {
    try {
      const order = this.ordersSelector.result().find((o) => o.id === orderId);
      const isLastItem = (order?.itemEntities.length ?? 0) === 1;
      if (isLastItem) {
        await this.repository.deleteOrder.mutateAsync({ orderId });
      } else {
        await this.repository.deleteOrderItem.mutateAsync({ orderId, itemId });
      }
    } catch (err) {
      console.error('DeleteOrderItemUseCase', err);
    }
  }
}
