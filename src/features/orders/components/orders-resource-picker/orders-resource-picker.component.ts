import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { OrdersPresentationStore } from '../../store';

interface Presenter {
  isLocalChecked: boolean;
  isRemoteChecked: boolean;
}

interface Controller {
  onLocalChanged(): void;
  onRemoteChanged(): void;
}

@Component({
  selector: 'app-orders-resource-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './orders-resource-picker.component.html',
})
export class OrdersResourcePicker implements Presenter, Controller {
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
