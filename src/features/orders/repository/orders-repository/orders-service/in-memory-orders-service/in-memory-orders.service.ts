import { Inject, Injectable, InjectionToken } from '@angular/core';
import { sleep } from '../../../../../../utils';
import type {
  ItemEntityId,
  OrderEntity,
  OrderEntityId,
  OrdersGateway,
} from '../../orders.repository.types';

export const INITIAL_ORDERS = new InjectionToken<OrderEntity[]>('INITIAL_ORDERS');

@Injectable()
export class InMemoryOrdersService implements OrdersGateway {
  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(@Inject(INITIAL_ORDERS) orders: OrderEntity[]) {
    this.orders = new Map(orders.map((order) => [order.id, order]));
  }

  private orders: Map<OrderEntityId, OrderEntity>;

  setOrders(orders: OrderEntity[]): void {
    this.orders.clear();
    orders.forEach((order) => this.orders.set(order.id, order));
  }

  async getOrders(): Promise<OrderEntity[]> {
    await sleep(1000);
    return Array.from(this.orders.values());
  }

  async deleteOrder(orderId: OrderEntityId): Promise<void> {
    await sleep(3000);
    if (!this.orders.has(orderId)) {
      throw new Error(`Order with id ${orderId} not found`);
    }
    this.orders.delete(orderId);
  }

  async deleteItem(orderId: OrderEntityId, itemId: ItemEntityId): Promise<void> {
    await sleep(2000);
    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error(`Order with id ${orderId} not found`);
    }
    this.orders.set(orderId, {
      ...order,
      itemEntities: order.itemEntities.filter((item) => item.id !== itemId),
    });
  }
}
