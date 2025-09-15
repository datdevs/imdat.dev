import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  imports: [AsyncPipe, MatGridListModule, MatMenuModule, MatIconModule, MatButtonModule, MatCardModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  private breakpointObserver = inject(BreakpointObserver);

  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { cols: 1, rows: 1, title: 'Card 1' },
          { cols: 1, rows: 1, title: 'Card 2' },
          { cols: 1, rows: 1, title: 'Card 3' },
          { cols: 1, rows: 1, title: 'Card 4' },
        ];
      }

      return [
        { cols: 2, rows: 1, title: 'Card 1' },
        { cols: 1, rows: 1, title: 'Card 2' },
        { cols: 1, rows: 2, title: 'Card 3' },
        { cols: 1, rows: 1, title: 'Card 4' },
      ];
    }),
  );
}
