import { describe, beforeEach, afterEach, it, expect, vi, assert } from 'vitest';
import { Deferred } from '@esfx/async-deferred';
import { provideZonelessChangeDetection, signal, type WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideTanStackQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { ItemByIdSelector, itemByIdSelectorContext } from './item-by-id.selector';
import { OrdersSelector } from '../orders.selector';
import {
  I_ORDERS_GATEWAY,
  OrdersRepository,
  makeItemEntityId,
  makeOrderEntityId,
  type ItemEntityId,
  type OrderEntity,
  type OrderEntityId,
} from '../../repository';
import { OrdersPresentationStore } from '../../store';
import { makeOrderEntities } from '../../test-utils';
import {
  makeOrdersGatewayMock,
  type MockedOrdersGateway,
} from '../../repository/orders-repository/utils/testing';

interface LocalTestContext {
  gatewayMock: MockedOrdersGateway;
  orderIdSignal: WritableSignal<OrderEntityId>;
  itemIdSignal: WritableSignal<ItemEntityId>;
  orderEntities: OrderEntity[];
}

describe(`${ItemByIdSelector.name}`, () => {
  const ordersGatewayMock = makeOrdersGatewayMock();

  beforeEach<LocalTestContext>((context) => {
    vi.useFakeTimers();
    context.gatewayMock = ordersGatewayMock.mock;
    context.orderIdSignal = signal(makeOrderEntityId('test'));
    context.itemIdSignal = signal(makeItemEntityId('test'));
    context.orderEntities = makeOrderEntities(3);

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideTanStackQuery(new QueryClient({ defaultOptions: { queries: { retry: false } } })),
        OrdersPresentationStore,
        OrdersRepository,
        OrdersSelector,
        ItemByIdSelector,
        { provide: I_ORDERS_GATEWAY, useValue: context.gatewayMock },
        {
          provide: itemByIdSelectorContext.token,
          useValue: { orderId: context.orderIdSignal, itemId: context.itemIdSignal },
        },
      ],
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it<LocalTestContext>('returns undefined when no orders are available', async (context) => {
    context.gatewayMock.getOrders.mockResolvedValue([]);

    const selector = TestBed.inject(ItemByIdSelector);

    await vi.runAllTimersAsync();

    expect(selector.result()).toBeUndefined();
  });

  it<LocalTestContext>('returns undefined while orders are being loaded', async (context) => {
    const { promise } = new Deferred<OrderEntity[]>();
    context.gatewayMock.getOrders.mockReturnValue(promise);

    const selector = TestBed.inject(ItemByIdSelector);

    await vi.runAllTimersAsync();

    expect(selector.result()).toBeUndefined();
  });

  it<LocalTestContext>('returns undefined when the order does not exist', async (context) => {
    context.gatewayMock.getOrders.mockResolvedValue(context.orderEntities);
    context.orderIdSignal.set(makeOrderEntityId('non-existent-order'));

    const selector = TestBed.inject(ItemByIdSelector);

    await vi.runAllTimersAsync();

    expect(selector.result()).toBeUndefined();
  });

  it<LocalTestContext>('returns undefined when the item does not exist in the order', async (context) => {
    context.gatewayMock.getOrders.mockResolvedValue(context.orderEntities);
    const targetOrder = context.orderEntities.at(0);
    assert(targetOrder);
    context.orderIdSignal.set(targetOrder.id);
    context.itemIdSignal.set(makeItemEntityId('non-existent-item'));

    const selector = TestBed.inject(ItemByIdSelector);

    await vi.runAllTimersAsync();

    expect(selector.result()).toBeUndefined();
  });

  it<LocalTestContext>('returns the correct item when it exists', async (context) => {
    context.gatewayMock.getOrders.mockResolvedValue(context.orderEntities);
    const targetOrder = context.orderEntities.at(1);
    assert(targetOrder);
    const targetItem = targetOrder.itemEntities.at(0);
    assert(targetItem);
    context.orderIdSignal.set(targetOrder.id);
    context.itemIdSignal.set(targetItem.id);

    const selector = TestBed.inject(ItemByIdSelector);

    await vi.runAllTimersAsync();

    expect(selector.result()).toEqual(targetItem);
  });
});
