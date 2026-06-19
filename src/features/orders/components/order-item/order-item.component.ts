import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { deleteItemButtonTestId, orderItemTestId } from '../../test-ids';
import { DeleteOrderItemUseCase } from '../../use-cases';
import {
  IsDeleteOrderMutatingSelector,
  isDeleteOrderMutatingSelectorContext,
  ItemByIdSelector,
  itemByIdSelectorContext,
} from '../../selectors';
import { ORDER_ITEM_CONTEXT, OrderItemContext } from './order-item.context';
import { OrderItemController, orderItemControllerContext } from './order-item.controller';
import { OrderItemPresenter, orderItemPresenterContext } from './order-item.presenter';

@Component({
  selector: 'app-order-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: OrderItemContext, inputs: ['orderId', 'itemId'] }],
  providers: [
    itemByIdSelectorContext.provide([ORDER_ITEM_CONTEXT], (context) => ({
      orderId: context.orderId,
      itemId: context.itemId,
    })),
    ItemByIdSelector,
    isDeleteOrderMutatingSelectorContext.provide(ORDER_ITEM_CONTEXT),
    IsDeleteOrderMutatingSelector,
    DeleteOrderItemUseCase,
    orderItemPresenterContext.provide(ORDER_ITEM_CONTEXT),
    OrderItemPresenter,
    orderItemControllerContext.provide(ORDER_ITEM_CONTEXT),
    OrderItemController,
  ],
  templateUrl: './order-item.component.html',
})
export class OrderItem {
  protected readonly presenter = inject(OrderItemPresenter);
  protected readonly controller = inject(OrderItemController);
  protected readonly orderItemTestId = orderItemTestId;
  protected readonly deleteItemButtonTestId = deleteItemButtonTestId;
}
