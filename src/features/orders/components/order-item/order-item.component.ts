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
import type { Controller, Presenter } from './order-item.types';
import type { ItemEntityId } from '../../repository';

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
export class OrderItem implements Presenter, Controller {
  private readonly presenter = inject(OrderItemPresenter);
  private readonly controller = inject(OrderItemController);
  protected readonly orderItemTestId = orderItemTestId;
  protected readonly deleteItemButtonTestId = deleteItemButtonTestId;

  get hasItem(): boolean {
    return this.presenter.hasItem;
  }

  get itemId(): ItemEntityId {
    return this.presenter.itemId;
  }

  get productId(): string {
    return this.presenter.productId;
  }

  get productQuantity(): number {
    return this.presenter.productQuantity;
  }

  get isDeleteItemButtonDisabled(): boolean {
    return this.presenter.isDeleteItemButtonDisabled;
  }

  deleteOrderItemButtonClicked(): void {
    this.controller.deleteOrderItemButtonClicked();
  }
}
