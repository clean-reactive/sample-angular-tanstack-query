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
import type { Controller, Presenter } from './order.types';
import type { ItemEntityId, OrderEntityId } from '../../repository';

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
export class Order implements Presenter, Controller {
  private readonly presenter = inject(I_ORDER_PRESENTER);
  private readonly controller = inject(I_ORDER_CONTROLLER);
  protected readonly orderTestId = orderTestId;
  protected readonly deleteOrderButtonTestId = deleteOrderButtonTestId;

  get hasOrder(): boolean {
    return this.presenter.hasOrder;
  }

  get orderId(): OrderEntityId {
    return this.presenter.orderId;
  }

  get userId(): string {
    return this.presenter.userId;
  }

  get itemIds(): ItemEntityId[] {
    return this.presenter.itemIds;
  }

  get summaryLabel(): string {
    return this.presenter.summaryLabel;
  }

  get isDeleteOrderButtonDisabled(): boolean {
    return this.presenter.isDeleteOrderButtonDisabled;
  }

  deleteOrderButtonClicked(): void {
    this.controller.deleteOrderButtonClicked();
  }
}
