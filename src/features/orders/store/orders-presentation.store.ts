import { Injectable, signal } from '@angular/core';

export type OrdersResource = 'local' | 'remote';

@Injectable()
export class OrdersPresentationStore {
  private readonly _ordersResource = signal<OrdersResource>('local');
  get ordersResource() {
    return this._ordersResource.asReadonly();
  }

  setOrdersResource(resource: OrdersResource): void {
    this._ordersResource.set(resource);
  }
}
