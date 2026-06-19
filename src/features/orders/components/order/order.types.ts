import { InjectionToken } from '@angular/core';
import type { ItemEntityId, OrderEntityId } from '../../repository';

export interface Presenter {
  hasOrder: boolean;
  orderId: OrderEntityId;
  userId: string;
  itemIds: ItemEntityId[];
  summaryLabel: string;
  isDeleteOrderButtonDisabled: boolean;
}

export interface Controller {
  deleteOrderButtonClicked(): void;
}

export const I_ORDER_PRESENTER = new InjectionToken<Presenter>('OrderPresenter');
export const I_ORDER_CONTROLLER = new InjectionToken<Controller>('OrderController');
