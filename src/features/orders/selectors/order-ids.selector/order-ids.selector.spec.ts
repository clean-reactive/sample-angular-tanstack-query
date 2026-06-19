import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { Deferred } from '@esfx/async-deferred';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideTanStackQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { OrderIdsSelector } from './order-ids.selector';
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

describe(`${OrderIdsSelector.name}`, () => {
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
        OrderIdsSelector,
        { provide: I_ORDERS_GATEWAY, useValue: context.gatewayMock },
      ],
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it<LocalTestContext>('returns an empty array when no orders are available', async (context) => {
    context.gatewayMock.getOrders.mockResolvedValue([]);

    const selector = TestBed.inject(OrderIdsSelector);

    await vi.runAllTimersAsync();

    expect(selector.result()).toEqual([]);
  });

  it<LocalTestContext>('returns an array of order IDs when orders are available', async (context) => {
    context.gatewayMock.getOrders.mockResolvedValue(context.orderEntities);

    const selector = TestBed.inject(OrderIdsSelector);

    await vi.runAllTimersAsync();

    expect(selector.result()).toEqual(context.orderEntities.map((order) => order.id));
  });

  it<LocalTestContext>('returns an empty array while orders are being loaded', async (context) => {
    const { promise } = new Deferred<OrderEntity[]>();
    context.gatewayMock.getOrders.mockReturnValue(promise);

    const selector = TestBed.inject(OrderIdsSelector);

    await vi.runAllTimersAsync();

    expect(selector.result()).toEqual([]);
  });
});
