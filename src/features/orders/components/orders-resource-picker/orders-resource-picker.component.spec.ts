import { Component, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideTanStackQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { OrdersResourcePicker } from './orders-resource-picker.component';
import { provideOrders } from '../../orders.providers';

@Component({
  standalone: true,
  template: '<app-orders-resource-picker></app-orders-resource-picker>',
  imports: [OrdersResourcePicker],
})
class TestHostComponent {}

describe(`${OrdersResourcePicker.name}`, () => {
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
