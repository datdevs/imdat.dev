import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-grid',
  imports: [],
  templateUrl: './grid-layout.html',
  styleUrl: './grid-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridLayout {
  readonly columns = input<number>(1);
  readonly gutter = input<string>('16px');
  readonly gutterColumn = input<string>('16px');
  readonly gutterRow = input<string>('16px');
  readonly rows = input<number>(1);
}
