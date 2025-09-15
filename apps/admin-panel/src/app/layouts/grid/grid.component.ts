import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-grid',
  imports: [],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss'
})
export class GridComponent {
  @Input() columns = 1;
  @Input() gutter = '16px';
  @Input() gutterColumn = '16px';
  @Input() gutterRow = '16px';
  @Input() rows = 1;
}
