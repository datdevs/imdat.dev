import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-grid',
  imports: [],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridComponent {
  readonly columns = input<number>(1);
  readonly gutter = input<string>('16px');
  readonly gutterColumn = input<string>('16px');
  readonly gutterRow = input<string>('16px');
  readonly rows = input<number>(1);
}
