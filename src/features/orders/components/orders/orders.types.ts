import type { OrderEntityId } from '../../repository';

export interface Presenter {
  orderIds: OrderEntityId[];
  isProcessing: boolean;
  statusLabel: string;
}
