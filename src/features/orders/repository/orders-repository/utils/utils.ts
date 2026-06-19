import type { ItemEntityId, OrderEntityId } from '../orders.repository.types';

export const ordersQueryKey = ['orders'] as const;
export const deleteOrderMutationKey = ['deleteOrder'] as const;
export const deleteOrderItemMutationKey = ['deleteOrderItem'] as const;

export const makeOrderEntityId = (id: string): OrderEntityId => id as OrderEntityId;
export const makeItemEntityId = (id: string): ItemEntityId => id as ItemEntityId;
