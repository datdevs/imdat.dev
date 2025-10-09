import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { TuiCheckboxTableDirective, TuiTable, TuiTableControl, TuiTableControlDirective } from '@taiga-ui/addon-table';
import { TuiButton, TuiDropdown, TuiTitle } from '@taiga-ui/core';
import { TuiCheckbox, TuiItemsWithMore, TuiStatus } from '@taiga-ui/kit';
import { TuiCell } from '@taiga-ui/layout';

import { Portfolio } from '../../../../models/portfolio';
import { PortfolioStore } from '../../../../store/portfolio/portfolio.store';

@Component({
  selector: 'app-portfolio-table',
  imports: [
    TuiButton,
    TuiCell,
    TuiCheckbox,
    TuiCheckboxTableDirective,
    TuiDropdown,
    TuiItemsWithMore,
    TuiStatus,
    TuiTable,
    TuiTableControl,
    TuiTableControlDirective,
    TuiTitle,
  ],
  templateUrl: './portfolio-table.html',
  styleUrl: './portfolio-table.scss',
  providers: [TuiTableControlDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioTable {
  private readonly portfolioStore = inject(PortfolioStore);
  protected readonly portfolios: Signal<Portfolio[]> = this.portfolioStore.portfolios;
  protected readonly loading: Signal<boolean> = this.portfolioStore.loading;

  constructor() {
    this.portfolioStore.loadPortfolios(null);
  }
}
