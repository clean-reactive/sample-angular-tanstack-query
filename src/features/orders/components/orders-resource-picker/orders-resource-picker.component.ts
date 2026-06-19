import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { OrdersPresentationStore } from '../../store';

@Component({
  selector: 'app-orders-resource-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './orders-resource-picker.component.html',
})
export class OrdersResourcePicker {
  private readonly presentationStore = inject(OrdersPresentationStore);

  // presenter
  get isLocalChecked(): boolean {
    return this.presentationStore.ordersResource() === 'local';
  }

  get isRemoteChecked(): boolean {
    return this.presentationStore.ordersResource() === 'remote';
  }

  // controller
  onLocalChanged(): void {
    this.presentationStore.setOrdersResource('local');
  }

  onRemoteChanged(): void {
    this.presentationStore.setOrdersResource('remote');
  }
}
