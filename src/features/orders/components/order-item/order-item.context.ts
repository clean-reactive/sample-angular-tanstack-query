import { Directive, forwardRef, input, InjectionToken } from '@angular/core';
import type { ItemEntityId, OrderEntityId } from '../../repository';

export const ORDER_ITEM_CONTEXT = new InjectionToken<OrderItemContext>('OrderItemContext');

@Directive({
  providers: [
    {
      provide: ORDER_ITEM_CONTEXT,
      useExisting: forwardRef(() => OrderItemContext),
    },
  ],
})
export class OrderItemContext {
  readonly orderId = input.required<OrderEntityId>();
  readonly itemId = input.required<ItemEntityId>();
}
