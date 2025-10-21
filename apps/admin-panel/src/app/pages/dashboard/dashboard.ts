import { DatePipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiAxes, TuiBarChart, TuiLegendItem, TuiPieChart } from '@taiga-ui/addon-charts';
import { TuiHovered } from '@taiga-ui/cdk/directives/hovered';
import { TuiAppearance, TuiButton } from '@taiga-ui/core';
import { TuiAvatar, TuiSkeleton } from '@taiga-ui/kit';
import { TuiCard, TuiCell, TuiHeader } from '@taiga-ui/layout';

import { StatusEnum } from '../../core/constants/status';
import { IPortfolio } from '../../models/portfolio';
import { PortfolioStore } from '../../store/portfolio/portfolio.store';
import { StatusPipe } from '../../utils/pipes';

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterLink,
    DatePipe,
    StatusPipe,
    NgOptimizedImage,

    TuiHeader,
    TuiAvatar,
    TuiCell,
    TuiButton,
    TuiCard,
    TuiAxes,
    TuiBarChart,
    TuiPieChart,
    TuiLegendItem,
    TuiAppearance,
    TuiHovered,
    TuiSkeleton,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  private readonly portfolioStore = inject(PortfolioStore);
  protected readonly isDashboardLoading: Signal<boolean> = this.portfolioStore.isDashboardLoading;
  protected readonly isRecentPortfoliosLoading: Signal<boolean> = this.portfolioStore.isRecentPortfoliosLoading;

  protected readonly recentPortfolios: Signal<IPortfolio[]> = computed(() => this.portfolioStore.recentPortfolios());
  protected readonly dashboardPortfolios: Signal<{
    archived: number;
    draft: number;
    published: number;
    statusDistribution: { count: number; status: StatusEnum }[];
    statusDistributionValue: number[];
    total: number;
  }> = computed(() => {
    const portfolios = this.portfolioStore.dashboardPortfolios();
    const published = portfolios?.filter((p) => p.status === StatusEnum.PUBLISHED).length ?? 0;
    const draft = portfolios?.filter((p) => p.status === StatusEnum.DRAFT).length ?? 0;
    const archived = portfolios?.filter((p) => p.status === StatusEnum.ARCHIVED).length ?? 0;

    const statusDistribution = [
      { status: StatusEnum.PUBLISHED, count: published },
      { status: StatusEnum.DRAFT, count: draft },
      { status: StatusEnum.ARCHIVED, count: archived },
    ];

    return {
      published,
      draft,
      archived,
      total: portfolios.length,
      statusDistribution,
      statusDistributionValue: statusDistribution.map((s) => s.count),
    };
  });

  protected pieChartActiveItemIndex = NaN;

  protected readonly value = [13769, 12367, 10172, 3018, 2592];

  protected readonly labels = ['Food', 'Cafe', 'OSS', 'Taxi', 'Other'];

  constructor() {
    this.portfolioStore.loadDashboardPortfolios();
    this.portfolioStore.loadRecentPortfolios();
  }

  onLegendOfPieChartHover(index: number, hovered: boolean): void {
    this.pieChartActiveItemIndex = hovered ? index : NaN;
  }
}
