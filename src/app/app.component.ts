import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Orders } from '../features';

@Component({
  selector: 'app-root',
  imports: [Orders],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col items-center p-8">
      <app-orders />
    </div>
  `,
  styles: [],
})
export class App {}
