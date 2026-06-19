import { Directive, forwardRef, input, InjectionToken } from '@angular/core';
import type { OrderEntityId } from '../../repository';

export const ORDER_CONTEXT = new InjectionToken<OrderContext>('OrderContext');

@Directive({
  providers: [
    {
      provide: ORDER_CONTEXT,
      useExisting: forwardRef(() => OrderContext),
    },
  ],
})
export class OrderContext {
  readonly orderId = input.required<OrderEntityId>();
}
