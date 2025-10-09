import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { tuiDialog } from '@taiga-ui/core';

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
  private readonly portfolioCreateDialog = tuiDialog(PortfolioForm, {
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
        this._openCreateDialog();
      }
    });
  }

  /**
   * Open the create dialog
   */
  private _openCreateDialog() {
    this.portfolioCreateDialog(undefined)
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
