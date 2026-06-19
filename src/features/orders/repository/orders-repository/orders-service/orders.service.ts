import { inject, Injectable } from '@angular/core';
import { OrdersPresentationStore } from '../../../store';
import type {
  ItemEntityId,
  OrderEntity,
  OrderEntityId,
  OrdersGateway,
} from '../orders.repository.types';
import { RemoteOrdersService } from './remote-orders-service';
import { InMemoryOrdersService } from './in-memory-orders-service';

@Injectable()
export class OrdersService implements OrdersGateway {
  private readonly presentationStore = inject(OrdersPresentationStore);
  private readonly local = inject(InMemoryOrdersService);
  private readonly remote = inject(RemoteOrdersService);

  private get active(): OrdersGateway {
    return this.presentationStore.ordersResource() === 'local' ? this.local : this.remote;
  }

  getOrders(): Promise<OrderEntity[]> {
    return this.active.getOrders();
  }

  deleteOrder(orderId: OrderEntityId): Promise<void> {
    return this.active.deleteOrder(orderId);
  }

  deleteItem(orderId: OrderEntityId, itemId: ItemEntityId): Promise<void> {
    return this.active.deleteItem(orderId, itemId);
  }
}
