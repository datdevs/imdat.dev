import { DatePipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiCheckboxTableDirective, TuiTable, TuiTableControl } from '@taiga-ui/addon-table';
import {
  TuiButton,
  TuiDataList,
  TuiDropdown,
  TuiOptionNew,
  TuiTitle,
  TuiAppearance,
  TuiDropdownContext,
} from '@taiga-ui/core';
import { TuiBadge, TuiCheckbox, TuiItemsWithMore, TuiSkeleton, TuiStatus } from '@taiga-ui/kit';
import { TuiCell } from '@taiga-ui/layout';

import { Empty } from '../../../../components/empty/empty';
import { Portfolio } from '../../../../models/portfolio';
import { PortfolioStore } from '../../../../store/portfolio/portfolio.store';
import { StatusPipe } from '../../../../utils/pipes';
import { AppearancePipe } from '../../../../utils/pipes/appearance-pipe';

@Component({
  selector: 'app-portfolio-table',
  imports: [
    FormsModule,
    TuiButton,
    TuiCell,
    TuiCheckbox,
    TuiCheckboxTableDirective,
    TuiDropdown,
    TuiDropdownContext,
    TuiItemsWithMore,
    TuiStatus,
    TuiTable,
    TuiTableControl,
    TuiTitle,
    TuiBadge,
    DatePipe,
    StatusPipe,
    AppearancePipe,
    TuiDataList,
    TuiOptionNew,
    NgOptimizedImage,
    TuiSkeleton,
    Empty,
    TuiAppearance,
  ],
  templateUrl: './portfolio-table.html',
  styleUrl: './portfolio-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioTable {
  protected selectedPortfolios: Portfolio[] = [];
  protected actionButtons = [
    {
      label: 'Edit',
      icon: 'pencil',
      appearance: 'info',
      onClick: (portfolio: Portfolio) => {
        this._editPortfolio(portfolio);
      },
    },
    {
      label: 'Delete',
      icon: 'trash',
      appearance: 'negative',
      onClick: (portfolio: Portfolio) => {
        this._deletePortfolio(portfolio);
      },
    },
  ];

  private readonly portfolioStore = inject(PortfolioStore);
  protected readonly portfolios: Signal<Portfolio[]> = this.portfolioStore.portfolios;
  protected readonly loading: Signal<boolean> = this.portfolioStore.loading;

  constructor() {
    this.portfolioStore.loadPortfolios(null);
  }

  /**
   * Edit a portfolio
   * @param {Portfolio} portfolio
   */
  private _editPortfolio(portfolio: Portfolio) {
    console.log(portfolio);
  }

  /**
   * Delete a portfolio
   * @param {Portfolio} portfolio
   */
  private _deletePortfolio(portfolio: Portfolio) {
    this.portfolioStore.deletePortfolio(portfolio.id);
  }
}
