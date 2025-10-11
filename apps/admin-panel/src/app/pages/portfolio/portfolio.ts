import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { tuiDialog } from '@taiga-ui/core';

import { Portfolio as PortfolioModel } from '../../models/portfolio';
import { PortfolioForm } from './components/portfolio-form/portfolio-form';
import { PortfolioTable } from './components/portfolio-table/portfolio-table';

@Component({
  selector: 'app-portfolio',
  imports: [PortfolioTable],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Portfolio {
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private portfolioDialog = tuiDialog(PortfolioForm, {
    label: 'Create Portfolio',
    dismissible: false,
    size: 'l',
  });

  constructor() {
    this._listenToRoute();
  }

  /**
   * Listen to the route and open the create dialog if the route is 'create'
   */
  private _listenToRoute() {
    this.route.url.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((url: UrlSegment[]) => {
      if (url.some((segment) => segment.path === 'create')) {
        this._openDialog();
      } else if (url.some((segment) => segment.path === 'edit')) {
        const portfolio = this.route.snapshot.data['portfolioData'] as PortfolioModel;
        this.portfolioDialog = tuiDialog(PortfolioForm, {
          label: `Edit ${portfolio.title}`,
          dismissible: false,
          size: 'l',
        });
        this._openDialog(portfolio);
      }
    });
  }

  /**
   * Open the portfolio dialog (create or edit)
   * @param {PortfolioModel} portfolio
   */
  private _openDialog(portfolio?: PortfolioModel) {
    this.portfolioDialog(portfolio)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.router.navigate(['/portfolio']);
        },
        error: () => {
          this.router.navigate(['/portfolio']);
        },
        complete: () => {
          this.router.navigate(['/portfolio']);
        },
      });
  }
}
