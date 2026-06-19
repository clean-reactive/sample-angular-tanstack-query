import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { deleteOrderButtonTestId, orderTestId } from '../../test-ids';
import { OrderItem } from '../order-item';
import {
  IsDeleteOrderMutatingSelector,
  isDeleteOrderMutatingSelectorContext,
  OrderByIdSelector,
  orderByIdSelectorContext,
} from '../../selectors';
import { ORDER_CONTEXT, OrderContext } from './order.context';
import { OrderController, orderControllerContext } from './order.controller';
import { OrderPresenter, orderPresenterContext } from './order.presenter';
import { I_ORDER_CONTROLLER, I_ORDER_PRESENTER } from './order.types';

@Component({
  selector: 'app-order',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrderItem],
  hostDirectives: [{ directive: OrderContext, inputs: ['orderId'] }],
  providers: [
    orderByIdSelectorContext.provide([ORDER_CONTEXT], (context) => ({
      orderId: context.orderId,
    })),
    OrderByIdSelector,
    isDeleteOrderMutatingSelectorContext.provide(ORDER_CONTEXT),
    IsDeleteOrderMutatingSelector,
    orderPresenterContext.provide(ORDER_CONTEXT),
    { provide: I_ORDER_PRESENTER, useClass: OrderPresenter },
    orderControllerContext.provide(ORDER_CONTEXT),
    { provide: I_ORDER_CONTROLLER, useClass: OrderController },
  ],
  templateUrl: './order.component.html',
})
export class Order {
  protected readonly presenter = inject(I_ORDER_PRESENTER);
  protected readonly controller = inject(I_ORDER_CONTROLLER);
  protected readonly orderTestId = orderTestId;
  protected readonly deleteOrderButtonTestId = deleteOrderButtonTestId;
}
