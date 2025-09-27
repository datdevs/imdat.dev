import { Component, Input } from '@angular/core';
import { TuiLoader } from '@taiga-ui/core';

@Component({
  selector: 'app-loading-overlay',
  imports: [TuiLoader],
  templateUrl: './loading-overlay.component.html',
  styleUrl: './loading-overlay.component.scss',
})
export class LoadingOverlayComponent {
  @Input() loading = false;
}
