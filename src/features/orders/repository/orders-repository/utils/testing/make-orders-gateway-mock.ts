import { vi, beforeEach, type Mocked } from 'vitest';
import type { OrdersGateway } from '../../orders.repository.types';

export type MockedOrdersGateway = Mocked<OrdersGateway>;

function makeMockInstance(): MockedOrdersGateway {
  return {
    getOrders: vi.fn<OrdersGateway['getOrders']>().mockResolvedValue([]),
    deleteOrder: vi.fn<OrdersGateway['deleteOrder']>(),
    deleteItem: vi.fn<OrdersGateway['deleteItem']>(),
  };
}

export function makeOrdersGatewayMock() {
  let mockInstance: MockedOrdersGateway;

  beforeEach(() => {
    mockInstance = makeMockInstance();
  });

  return {
    get mock() {
      return mockInstance;
    },
  };
}
