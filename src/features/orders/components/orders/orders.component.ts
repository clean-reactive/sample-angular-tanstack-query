import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ordersTestId } from '../../test-ids';
import { Order } from '../order';
import { OrdersResourcePicker } from '../orders-resource-picker';
import { OrdersStatistics } from '../orders-statistics';
import { OrdersPresenter } from './orders.presenter';
import type { Presenter } from './orders.types';
import type { OrderEntityId } from '../../repository';

@Component({
  selector: 'app-orders',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Order, OrdersResourcePicker, OrdersStatistics],
  providers: [OrdersPresenter],
  templateUrl: './orders.component.html',
})
export class Orders implements Presenter {
  protected readonly ordersTestId = ordersTestId;
  private readonly presenter = inject(OrdersPresenter);

  get orderIds(): OrderEntityId[] {
    return this.presenter.orderIds;
  }

  get isProcessing(): boolean {
    return this.presenter.isProcessing;
  }

  get statusLabel(): string {
    return this.presenter.statusLabel;
  }
}
