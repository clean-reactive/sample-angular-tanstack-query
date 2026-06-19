import { InjectionToken } from '@angular/core';
import type { Nominal } from '../../../../@types';

export type OrderEntityId = Nominal<string, 'ORDER_ENTITY_ID'>;
export type ItemEntityId = Nominal<string, 'ITEM_ENTITY_ID'>;

export type ItemEntity = {
  id: ItemEntityId;
  productId: string;
  quantity: number;
};

export type OrderEntity = {
  id: OrderEntityId;
  userId: string;
  itemEntities: ItemEntity[];
};

export interface OrdersGateway {
  getOrders(): Promise<OrderEntity[]>;
  deleteOrder(orderId: OrderEntityId): Promise<void>;
  deleteItem(orderId: OrderEntityId, itemId: ItemEntityId): Promise<void>;
}

export const I_ORDERS_GATEWAY = new InjectionToken<OrdersGateway>('OrdersGateway');
