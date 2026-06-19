import { Component, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideTanStackQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { Order } from './order.component';
import { makeOrderEntityId, type OrderEntityId } from '../../repository';
import { provideOrders } from '../../orders.providers';

@Component({
  standalone: true,
  template: '<app-order [orderId]="orderId"></app-order>',
  imports: [Order],
})
class TestHostComponent {
  readonly orderId: OrderEntityId = makeOrderEntityId('order-1');
}

describe(`${Order.name}`, () => {
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
