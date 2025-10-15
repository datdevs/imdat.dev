import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, linkedSignal, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiDayRange } from '@taiga-ui/cdk/date-time';
import { TuiButton, TuiDropdown, TuiTextfield } from '@taiga-ui/core';
import { TuiChip, TuiFilter, TuiInputChip, TuiInputDateRange } from '@taiga-ui/kit';

import { STATUS_OPTIONS, StatusEnum } from '../../../../core/constants/status';
import { Status } from '../../../../models/common';
import { PortfolioFilters } from '../../../../models/portfolio';
import { PortfolioStore } from '../../../../store/portfolio/portfolio.store';
import { StatusPipe } from '../../../../utils/pipes';

@Component({
  selector: 'app-portfolio-filter',
  imports: [
    FormsModule,
    TuiFilter,
    TuiButton,
    TuiTextfield,
    TuiInputDateRange,
    TuiDropdown,
    TuiInputChip,
    TuiChip,
    DatePipe,
    StatusPipe,
  ],
  templateUrl: './portfolio-filter.html',
  styleUrl: './portfolio-filter.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioFilter {
  protected readonly statusOptions: Status<StatusEnum>[] = STATUS_OPTIONS;
  protected readonly selectedStatuses: WritableSignal<Status<StatusEnum>[]> = signal<Status<StatusEnum>[]>([]);
  // protected readonly search: WritableSignal<string> = signal<string>('');
  protected readonly updatedDateRange: WritableSignal<null | TuiDayRange> = signal<null | TuiDayRange>(null);
  protected readonly publishedDateRange: WritableSignal<null | TuiDayRange> = signal<null | TuiDayRange>(null);
  protected readonly technologies: WritableSignal<string[]> = signal<string[]>([]);
  protected readonly features: WritableSignal<string[]> = signal<string[]>([]);
  protected readonly dropdownOpen: WritableSignal<boolean> = signal<boolean>(false);

  private readonly store = inject(PortfolioStore);
  protected readonly appliedFilters: WritableSignal<
    Omit<
      PortfolioFilters,
      'cursor' | 'firstDoc' | 'lastDoc' | 'limit' | 'orderBy' | 'orderDirection' | 'page' | 'total'
    >
  > = linkedSignal(() => ({
    features: this.store.filters().features,
    statuses: this.store.filters().statuses,
    technologies: this.store.filters().technologies,
    updatedDateRange: this.store.filters().updatedDateRange,
    publishedDateRange: this.store.filters().publishedDateRange,
  }));

  /**
   * Apply filters and close dropdown
   */
  applyFilters(): void {
    this.store.updateFilters({
      technologies: this.technologies(),
      features: this.features(),
      statuses: this.selectedStatuses().map((status) => status.value),
      updatedDateRange: this.updatedDateRange() ?? undefined,
      publishedDateRange: this.publishedDateRange() ?? undefined,
    });
    this.store.loadPortfolios();
    this.dropdownOpen.set(false);
  }

  /**
   * Clear filters
   */
  clearFilters(): void {
    this.updatedDateRange.set(null);
    this.publishedDateRange.set(null);
    this.technologies.set([]);
    this.features.set([]);
    this.selectedStatuses.set([]);
  }
}
