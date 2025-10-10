import { CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { faker } from '@faker-js/faker';
import {
  TuiCheckboxTableDirective,
  TuiTable,
  TuiTableControl,
  TuiTablePagination,
  TuiTablePaginationEvent,
} from '@taiga-ui/addon-table';
import {
  TuiAppearance,
  TuiButton,
  TuiDataList,
  TuiDropdown,
  TuiDropdownContext,
  TuiLoader,
  TuiOptionNew,
  TuiScrollable,
  TuiScrollbar,
  TuiTitle,
} from '@taiga-ui/core';
import { TuiBadge, TuiCheckbox, TuiItemsWithMore, TuiStatus } from '@taiga-ui/kit';
import { TuiCard, TuiCell } from '@taiga-ui/layout';

import { Empty } from '../../../../components/empty/empty';
import { StatusEnum } from '../../../../core/constants/status';
import { CreatePortfolioRequest, Portfolio } from '../../../../models/portfolio';
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
    Empty,
    TuiAppearance,
    TuiTablePagination,
    TuiCard,
    CdkFixedSizeVirtualScroll,
    CdkVirtualForOf,
    CdkVirtualScrollViewport,
    TuiScrollable,
    TuiScrollbar,
    TuiLoader,
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
  protected readonly totalPortfolios: Signal<number> = this.portfolioStore.totalPortfolios;
  protected readonly page = computed(() => this.portfolioStore.filters()?.page ?? 0);
  protected readonly size = computed(() => this.portfolioStore.filters()?.limit ?? 10);

  constructor() {
    this.portfolioStore.loadPortfolios();
    // this.createFakeData();
  }

  createFakeData() {
    const fakeData: CreatePortfolioRequest[] = faker.helpers.multiple(
      () => ({
        createdAt: faker.date.recent({ days: 365 }),
        updatedAt: faker.date.recent({ days: 365 }),
        publishedAt: faker.date.recent({ days: 365 }),
        title: faker.book.title(),
        description: faker.lorem.paragraph(),
        shortDescription: faker.lorem.sentence(),
        technologies: faker.helpers.multiple(() => faker.lorem.word(), { count: 3 }),
        features: faker.helpers.multiple(() => faker.lorem.word(), { count: 3 }),
        images: faker.helpers.multiple(
          () => ({
            url: faker.image.urlPicsumPhotos(),
            alt: faker.lorem.word(),
            isMain: false,
          }),
          { count: 3 },
        ),
        featured: faker.datatype.boolean(),
        order: 0,
        status: faker.helpers.arrayElement(Object.values(StatusEnum)),
        githubUrl: faker.internet.url(),
        liveUrl: faker.internet.url(),
      }),
      {
        count: 100,
      },
    );

    console.log(fakeData);
    // fakeData.forEach((portfolio) => {
    //   this.portfolioStore.createPortfolio(portfolio);
    // });
  }

  /**
   * Handle pagination change
   * @param {TuiTablePaginationEvent} event
   */
  onPaginationChange({ page, size }: TuiTablePaginationEvent) {
    this.portfolioStore.updateFilters({
      page,
      limit: size,
    });
    this.portfolioStore.loadPortfolios();
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
