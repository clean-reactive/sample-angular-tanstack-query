import { Component, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideTanStackQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { OrderItem } from './order-item.component';
import {
  makeItemEntityId,
  makeOrderEntityId,
  type ItemEntityId,
  type OrderEntityId,
} from '../../repository';
import { provideOrders } from '../../orders.providers';

@Component({
  standalone: true,
  template: '<app-order-item [orderId]="orderId" [itemId]="itemId"></app-order-item>',
  imports: [OrderItem],
})
class TestHostComponent {
  readonly orderId: OrderEntityId = makeOrderEntityId('order-1');
  readonly itemId: ItemEntityId = makeItemEntityId('item-1');
}

describe(`${OrderItem.name}`, () => {
  it('has all dependencies resolved', async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideTanStackQuery(new QueryClient()),
        provideOrders(),
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });
});
