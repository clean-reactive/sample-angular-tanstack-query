import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { type ApiOrderDto, OrdersHttpService } from '../../../../api';
import type {
  ItemEntity,
  ItemEntityId,
  OrderEntity,
  OrderEntityId,
  OrdersGateway,
} from '../../orders.repository.types';

function toItemEntity(dto: { id: string; productId: string; quantity: number }): ItemEntity {
  return {
    id: dto.id as ItemEntityId,
    productId: dto.productId,
    quantity: dto.quantity,
  };
}

function toOrderEntity(dto: ApiOrderDto): OrderEntity {
  return {
    id: dto.id as OrderEntityId,
    userId: dto.userId,
    itemEntities: dto.items.map(toItemEntity),
  };
}

@Injectable()
export class RemoteOrdersService implements OrdersGateway {
  private readonly http = inject(OrdersHttpService);

  async getOrders(): Promise<OrderEntity[]> {
    const dtos = await firstValueFrom(this.http.getOrders());
    return dtos.map(toOrderEntity);
  }

  async deleteOrder(orderId: OrderEntityId): Promise<void> {
    await firstValueFrom(this.http.deleteOrder(orderId));
  }

  async deleteItem(orderId: OrderEntityId, itemId: ItemEntityId): Promise<void> {
    const orderDto = await firstValueFrom(this.http.getOrder(orderId));
    const itemExists = orderDto.items.some((item) => item.id === itemId);
    if (!itemExists) {
      return;
    }
    const updatedOrder: ApiOrderDto = {
      ...orderDto,
      items: orderDto.items.filter((item) => item.id !== itemId),
    };
    await firstValueFrom(this.http.updateOrder(orderId, updatedOrder));
  }
}
