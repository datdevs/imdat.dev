import { CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal, Signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  TuiCheckboxTableDirective,
  TuiSortChange,
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
import { IPortfolio, PortfolioFilters } from '../../../../models/portfolio';
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
  protected columns: string[] = [
    'checkbox',
    'title',
    'shortDescription',
    'status',
    'updatedAt',
    'publishedAt',
    'actions',
  ];

  protected readonly selectedPortfolios: WritableSignal<IPortfolio[]> = signal<IPortfolio[]>([]);
  protected actionButtons = [
    {
      label: 'Edit',
      icon: 'pencil',
      appearance: 'info',
      onClick: (portfolio: IPortfolio) => {
        this._editPortfolio(portfolio);
      },
    },
    {
      label: 'Delete',
      icon: 'trash',
      appearance: 'negative',
      onClick: (portfolio: IPortfolio) => {
        this._deletePortfolio(portfolio);
      },
    },
  ];

  private readonly portfolioStore = inject(PortfolioStore);
  protected readonly portfolios: Signal<IPortfolio[]> = this.portfolioStore.portfolios;
  protected readonly loading: Signal<boolean> = this.portfolioStore.loading;
  protected readonly totalPortfolios: Signal<number> = this.portfolioStore.totalPortfolios;
  protected readonly page: Signal<number> = computed(() => this.portfolioStore.filters()?.page ?? 1);
  protected readonly size: Signal<number> = computed(() => this.portfolioStore.filters()?.limit ?? 10);
  protected readonly direction: Signal<-1 | 1> = computed(() =>
    this.portfolioStore.filters()?.orderDirection === 'asc' ? 1 : -1,
  );

  protected readonly sortBy: Signal<keyof IPortfolio> = computed(
    () => this.portfolioStore.filters()?.orderBy ?? 'updatedAt',
  );

  private readonly router = inject(Router);

  constructor() {
    this.portfolioStore.loadPortfolios();

    // this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params: Params) => {
    //   const filters: Partial<PortfolioFilters> = params;

    //   this.portfolioStore.updateFilters(filters);
    //   this.portfolioStore.loadPortfolios();
    // });
  }

  /**
   * Handle pagination change
   * @param {TuiTablePaginationEvent} event
   */
  onPaginationChange({ page, size }: TuiTablePaginationEvent) {
    const pageNumber = page + 1;

    const filters: Partial<PortfolioFilters> = {
      page: pageNumber,
      limit: size,
      orderBy: this.portfolioStore.filters()?.orderBy ?? 'updatedAt',
      orderDirection: this.portfolioStore.filters()?.orderDirection ?? 'desc',
    };

    if (pageNumber > this.page()) {
      filters.cursor = 'next';
    } else if (pageNumber < this.page()) {
      filters.cursor = 'prev';
    }

    // this._updateParams(filters);
    this.portfolioStore.updateFilters(filters);
    this.portfolioStore.loadPortfolios();
  }

  /**
   * Handle sort change
   * @param event
   */
  sortChange(event: TuiSortChange<IPortfolio>): void {
    // this._updateParams({
    //   orderBy: event.sortKey ?? this.sortBy(),
    //   orderDirection: event.sortDirection === 1 ? 'asc' : 'desc',
    // });

    this.portfolioStore.updateFilters({
      orderBy: event.sortKey ?? this.sortBy(),
      orderDirection: event.sortDirection === 1 ? 'asc' : 'desc',
    });
    this.portfolioStore.loadPortfolios();
  }

  /**
   * Edit a portfolio
   * @param {IPortfolio} portfolio
   */
  private _editPortfolio(portfolio: IPortfolio) {
    this.router.navigate(['/portfolio/edit', portfolio.id]);
  }

  /**
   * Delete a portfolio
   * @param {IPortfolio} portfolio
   */
  private _deletePortfolio(portfolio: IPortfolio) {
    this.portfolioStore.deletePortfolio(portfolio.id);
  }

  /**
   * Update the params in the route
   * @param {Partial<PortfolioFilters>} filters
   */
  // private _updateParams(filters: Partial<PortfolioFilters>) {
  //   this.router.navigate(['/portfolio'], { queryParams: filters });
  // }

  /**
   * Create fake data
   */
  // private _createFakeData() {
  //   const fakeData: PortfolioRequestBody[] = faker.helpers.multiple(
  //     () => ({
  //       createdAt: faker.date.recent({ days: 365 }),
  //       updatedAt: faker.date.recent({ days: 365 }),
  //       publishedAt: faker.date.recent({ days: 365 }),
  //       title: faker.book.title(),
  //       description: faker.lorem.paragraph(),
  //       shortDescription: faker.lorem.sentence(),
  //       technologies: faker.helpers.multiple(() => faker.lorem.word(), { count: 3 }),
  //       features: faker.helpers.multiple(() => faker.lorem.word(), { count: 3 }),
  //       images: faker.helpers.multiple(
  //         () => ({
  //           url: faker.image.urlPicsumPhotos(),
  //           alt: faker.lorem.word(),
  //           isMain: false,
  //         }),
  //         { count: 3 },
  //       ),
  //       featured: faker.datatype.boolean(),
  //       status: faker.helpers.arrayElement(Object.values(StatusEnum)),
  //       githubUrl: faker.internet.url(),
  //       liveUrl: faker.internet.url(),
  //     }),
  //     {
  //       count: 101,
  //     },
  //   );

  //   // fakeData = fakeData.sort((a: any, b: any) => b.updatedAt.getTime() - a.updatedAt.getTime());
  //   // fakeData = fakeData.map((portfolio, index) => ({ ...portfolio, title: index.toString() }));

  //   console.log(fakeData);

  //   fakeData.forEach((portfolio) => {
  //     this.portfolioStore.createPortfolio(portfolio);
  //   });
  // }
}
