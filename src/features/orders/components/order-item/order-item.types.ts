import type { ItemEntityId } from '../../repository';

export interface Presenter {
  hasItem: boolean;
  itemId: ItemEntityId;
  productId: string;
  productQuantity: number;
  isDeleteItemButtonDisabled: boolean;
}

export interface Controller {
  deleteOrderItemButtonClicked(): void;
}
