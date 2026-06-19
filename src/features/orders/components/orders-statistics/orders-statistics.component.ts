import { ChangeDetectionStrategy, Component, computed, inject, type Signal } from '@angular/core';
import { OrdersSelector, TotalItemsQuantitySelector } from '../../selectors';
import { totalItemQuantityTestId } from '../../test-ids';
import type { OrderEntity } from '../../repository';

@Component({
  selector: 'app-orders-statistics',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './orders-statistics.component.html',
})
export class OrdersStatistics {
  private readonly ordersSelector = inject(OrdersSelector);
  private readonly totalItemsQuantitySelector = inject(TotalItemsQuantitySelector);

  private get _orders(): Signal<OrderEntity[]> {
    return this.ordersSelector.result;
  }
  private readonly _uniqueUsersCount: Signal<number> = computed(
    () => new Set(this._orders().map((o) => o.userId)).size,
  );
  private readonly _itemLinesCount: Signal<number> = computed(() =>
    this._orders().reduce((acc, o) => acc + o.itemEntities.length, 0),
  );

  protected readonly totalItemQuantityTestId = totalItemQuantityTestId;

  // presenter
  get uniqueUsersCount(): number {
    return this._uniqueUsersCount();
  }

  get ordersCount(): number {
    return this._orders().length;
  }

  get itemLinesCount(): number {
    return this._itemLinesCount();
  }

  get totalItemsQuantity(): number {
    return this.totalItemsQuantitySelector.result();
  }
}
