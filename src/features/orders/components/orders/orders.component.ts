import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ordersTestId } from '../../test-ids';
import { Order } from '../order';
import { OrdersResourcePicker } from '../orders-resource-picker';
import { OrdersStatistics } from '../orders-statistics';
import { OrdersPresenter } from './orders.presenter';

@Component({
  selector: 'app-orders',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Order, OrdersResourcePicker, OrdersStatistics],
  providers: [OrdersPresenter],
  templateUrl: './orders.component.html',
})
export class Orders {
  protected readonly ordersTestId = ordersTestId;
  protected readonly presenter = inject(OrdersPresenter);
}
