import { inject, Injectable } from '@angular/core';
import { injectMutation, injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { I_ORDERS_GATEWAY } from './orders.repository.types';
import type { ItemEntityId, OrderEntity, OrderEntityId } from './orders.repository.types';
import { deleteOrderItemMutationKey, deleteOrderMutationKey, ordersQueryKey } from './utils';
import { OrdersPresentationStore } from '../../store';

@Injectable()
export class OrdersRepository {
  private readonly gateway = inject(I_ORDERS_GATEWAY);
  private readonly presentationStore = inject(OrdersPresentationStore);
  private readonly queryClient = inject(QueryClient);

  readonly getOrders = injectQuery(() => ({
    queryKey: [...ordersQueryKey, this.presentationStore.ordersResource()] as const,
    queryFn: (): Promise<OrderEntity[]> => this.gateway.getOrders(),
  }));

  readonly deleteOrder = injectMutation(() => ({
    mutationKey: deleteOrderMutationKey,
    mutationFn: ({ orderId }: { orderId: OrderEntityId }) => this.gateway.deleteOrder(orderId),
    onMutate: async ({ orderId }: { orderId: OrderEntityId }) => {
      await this.queryClient.cancelQueries({ queryKey: ordersQueryKey });
      const previousOrders = this.queryClient.getQueriesData<OrderEntity[]>({
        queryKey: ordersQueryKey,
      });
      this.queryClient.setQueriesData<OrderEntity[]>(
        { queryKey: ordersQueryKey },
        (orders) => orders?.filter((order) => order.id !== orderId) ?? [],
      );
      return { previousOrders };
    },
    onError: (_err, _vars, context) => {
      context?.previousOrders.forEach(([queryKey, data]) => {
        this.queryClient.setQueryData(queryKey, data);
      });
    },
    onSettled: () => {
      const mutationCache = this.queryClient.getMutationCache();
      const hasPendingMutation =
        mutationCache.findAll({ mutationKey: deleteOrderMutationKey, status: 'pending' }).length >
          1 ||
        mutationCache.findAll({ mutationKey: deleteOrderItemMutationKey, status: 'pending' })
          .length > 0;
      if (hasPendingMutation) {
        return;
      }
      void this.queryClient.invalidateQueries({ queryKey: ordersQueryKey });
    },
  }));

  readonly deleteOrderItem = injectMutation(() => ({
    mutationKey: deleteOrderItemMutationKey,
    mutationFn: ({ orderId, itemId }: { orderId: OrderEntityId; itemId: ItemEntityId }) =>
      this.gateway.deleteItem(orderId, itemId),
    onMutate: async ({ orderId, itemId }: { orderId: OrderEntityId; itemId: ItemEntityId }) => {
      await this.queryClient.cancelQueries({ queryKey: ordersQueryKey });
      const previousOrders = this.queryClient.getQueriesData<OrderEntity[]>({
        queryKey: ordersQueryKey,
      });
      this.queryClient.setQueriesData<OrderEntity[]>({ queryKey: ordersQueryKey }, (orders) => {
        if (!orders) {
          return [];
        }
        return orders.map((order) => {
          if (order.id !== orderId) {
            return order;
          }
          return {
            ...order,
            itemEntities: order.itemEntities.filter((item) => item.id !== itemId),
          };
        });
      });
      return { previousOrders };
    },
    onError: (_err, _vars, context) => {
      context?.previousOrders.forEach(([queryKey, data]) => {
        this.queryClient.setQueryData(queryKey, data);
      });
    },
    onSettled: () => {
      const mutationCache = this.queryClient.getMutationCache();
      const hasPendingMutation =
        mutationCache.findAll({ mutationKey: deleteOrderMutationKey, status: 'pending' }).length >
          0 ||
        mutationCache.findAll({ mutationKey: deleteOrderItemMutationKey, status: 'pending' })
          .length > 1;
      if (hasPendingMutation) {
        return;
      }
      void this.queryClient.invalidateQueries({ queryKey: ordersQueryKey });
    },
  }));
}
