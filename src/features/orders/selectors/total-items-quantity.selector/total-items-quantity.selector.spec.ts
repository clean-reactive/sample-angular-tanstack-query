import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideTanStackQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { TotalItemsQuantitySelector } from './total-items-quantity.selector';
import { OrdersSelector } from '../orders.selector';
import { I_ORDERS_GATEWAY, OrdersRepository, type OrderEntity } from '../../repository';
import { OrdersPresentationStore } from '../../store';
import { makeOrderEntities } from '../../test-utils';
import {
  makeOrdersGatewayMock,
  type MockedOrdersGateway,
} from '../../repository/orders-repository/utils/testing';

interface LocalTestContext {
  gatewayMock: MockedOrdersGateway;
  orderEntities: OrderEntity[];
}

describe(`${TotalItemsQuantitySelector.name}`, () => {
  const ordersGatewayMock = makeOrdersGatewayMock();

  beforeEach<LocalTestContext>((context) => {
    vi.useFakeTimers();
    context.gatewayMock = ordersGatewayMock.mock;
    context.orderEntities = makeOrderEntities(3);

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideTanStackQuery(new QueryClient({ defaultOptions: { queries: { retry: false } } })),
        OrdersPresentationStore,
        OrdersRepository,
        OrdersSelector,
        TotalItemsQuantitySelector,
        { provide: I_ORDERS_GATEWAY, useValue: context.gatewayMock },
      ],
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it<LocalTestContext>('returns 0 when there are no orders', async (context) => {
    context.gatewayMock.getOrders.mockResolvedValue([]);

    const selector = TestBed.inject(TotalItemsQuantitySelector);

    await vi.runAllTimersAsync();

    expect(selector.result()).toBe(0);
  });

  it<LocalTestContext>('returns 0 when the gateway fails to fetch orders', async (context) => {
    context.gatewayMock.getOrders.mockRejectedValue(new Error('network error'));

    const selector = TestBed.inject(TotalItemsQuantitySelector);

    await vi.runAllTimersAsync();

    expect(selector.result()).toBe(0);
  });

  it<LocalTestContext>('returns the total quantity of items across all orders', async (context) => {
    context.gatewayMock.getOrders.mockResolvedValue(context.orderEntities);

    const selector = TestBed.inject(TotalItemsQuantitySelector);

    await vi.runAllTimersAsync();

    const expected = context.orderEntities.reduce(
      (acc, entity) =>
        acc + entity.itemEntities.reduce((itemAcc, item) => itemAcc + item.quantity, 0),
      0,
    );
    expect(selector.result()).toBe(expected);
  });
});
