import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { apiOrderDtoFactory } from '../../../../api/api-orders-dto.factory';
import { OrdersHttpService, apiOrdersResource } from '../../../../api';
import { RemoteOrdersService } from './remote-orders.service';
import type { OrderEntity } from '../../orders.repository.types';
import { makeItemEntityId, makeOrderEntityId } from '../../utils';

const server = setupServer();

type Context = {
  service: RemoteOrdersService;
};

describe(`${RemoteOrdersService.name}`, () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
  });

  beforeEach<Context>((ctx) => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(withFetch()),
        OrdersHttpService,
        RemoteOrdersService,
      ],
    });
    ctx.service = TestBed.inject(RemoteOrdersService);
    server.resetHandlers();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  afterAll(() => {
    server.close();
  });

  describe(`${RemoteOrdersService.prototype.deleteOrder.name}`, () => {
    it<Context>('fetches and maps DTOs to OrderEntity[]', async (ctx) => {
      const dtos = apiOrderDtoFactory.list({ count: 2 });
      const expected: OrderEntity[] = [
        {
          id: makeOrderEntityId('1'),
          userId: '75',
          itemEntities: [
            { id: makeItemEntityId('1'), productId: '59', quantity: 75 },
            { id: makeItemEntityId('2'), productId: '17', quantity: 50 },
            { id: makeItemEntityId('3'), productId: '93', quantity: 60 },
          ],
        },
        {
          id: makeOrderEntityId('2'),
          userId: '50',
          itemEntities: [
            { id: makeItemEntityId('4'), productId: '25', quantity: 92 },
            { id: makeItemEntityId('5'), productId: '10', quantity: 14 },
            { id: makeItemEntityId('6'), productId: '21', quantity: 68 },
          ],
        },
      ];

      server.use(http.get(apiOrdersResource, () => HttpResponse.json(dtos, { status: 200 })));

      const result = await ctx.service.getOrders();

      expect(result).toEqual(expected);
    });

    it<Context>('rejects on HTTP error', async (ctx) => {
      server.use(http.get(apiOrdersResource, () => new HttpResponse(null, { status: 500 })));

      await expect(ctx.service.getOrders()).rejects.toThrow();
    });

    it<Context>('rejects on network error', async (ctx) => {
      server.use(http.get(apiOrdersResource, () => HttpResponse.error()));

      await expect(ctx.service.getOrders()).rejects.toThrow();
    });
  });

  describe(`${RemoteOrdersService.prototype.deleteItem.name}`, () => {
    it<Context>('sends DELETE request for the given order id', async (ctx) => {
      const orderId = makeOrderEntityId('order-1');
      server.use(
        http.delete(
          `${apiOrdersResource}/${orderId}`,
          () => new HttpResponse(null, { status: 200 }),
        ),
      );

      await expect(ctx.service.deleteOrder(orderId)).resolves.toBeUndefined();
    });

    it<Context>('rejects on HTTP error', async (ctx) => {
      const orderId = makeOrderEntityId('order-1');
      server.use(
        http.delete(
          `${apiOrdersResource}/${orderId}`,
          () => new HttpResponse(null, { status: 404 }),
        ),
      );

      await expect(ctx.service.deleteOrder(orderId)).rejects.toThrow();
    });

    it<Context>('rejects on network error', async (ctx) => {
      const orderId = makeOrderEntityId('order-1');
      server.use(http.delete(`${apiOrdersResource}/${orderId}`, () => HttpResponse.error()));

      await expect(ctx.service.deleteOrder(orderId)).rejects.toThrow();
    });
  });

  describe(`${RemoteOrdersService.prototype.deleteItem.name}`, () => {
    it<Context>('removes the item and PUTs the updated order', async (ctx) => {
      const dto = apiOrderDtoFactory.item({
        id: 'order-1',
        userId: 'user-1',
        items: [
          { id: 'item-1', productId: 'p1', quantity: 1 },
          { id: 'item-2', productId: 'p2', quantity: 2 },
        ],
      });
      const orderId = makeOrderEntityId('order-1');
      const itemId = makeItemEntityId('item-2');

      server.use(
        http.get(`${apiOrdersResource}/${orderId}`, () => HttpResponse.json(dto, { status: 200 })),
        http.put(`${apiOrdersResource}/${orderId}`, async ({ request }) => {
          const body = (await request.json()) as { items: Array<{ id: string }> };
          if (body.items.some((item) => item.id === itemId)) {
            return new HttpResponse('item was not removed', { status: 400 });
          }
          return new HttpResponse(null, { status: 200 });
        }),
      );

      await expect(ctx.service.deleteItem(orderId, itemId)).resolves.not.toThrow();
    });

    it<Context>('does not PUT when item does not exist in the order', async (ctx) => {
      const dto = apiOrderDtoFactory.item({
        id: 'order-1',
        items: [{ id: 'item-2', productId: 'p2', quantity: 2 }],
      });
      const orderId = makeOrderEntityId(dto.id);
      const itemId = makeItemEntityId('item-nonexistent');

      server.use(
        http.get(`${apiOrdersResource}/${orderId}`, () => HttpResponse.json(dto, { status: 200 })),
      );

      await expect(ctx.service.deleteItem(orderId, itemId)).resolves.toBeUndefined();
    });

    it<Context>('rejects when GET order fails', async (ctx) => {
      const orderId = makeOrderEntityId('order-1');
      const itemId = makeItemEntityId('item-1');
      server.use(
        http.get(`${apiOrdersResource}/${orderId}`, () => new HttpResponse(null, { status: 404 })),
      );

      await expect(ctx.service.deleteItem(orderId, itemId)).rejects.toThrow();
    });

    it<Context>('rejects when PUT order fails', async (ctx) => {
      const dto = apiOrderDtoFactory.item({
        id: 'order-1',
        items: [{ id: 'item-1', productId: 'p1', quantity: 1 }],
      });
      const orderId = makeOrderEntityId(dto.id);
      const itemId = makeItemEntityId('item-1');

      server.use(
        http.get(`${apiOrdersResource}/${orderId}`, () => HttpResponse.json(dto, { status: 200 })),
        http.put(`${apiOrdersResource}/${orderId}`, () => new HttpResponse(null, { status: 500 })),
      );

      await expect(ctx.service.deleteItem(orderId, itemId)).rejects.toThrow();
    });
  });
});
