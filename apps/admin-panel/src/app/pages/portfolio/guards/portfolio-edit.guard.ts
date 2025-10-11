import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { of, switchMap } from 'rxjs';

import { Portfolio } from '../../../models/portfolio';
import { PortfolioService } from '../../../services';

export const portfolioEditGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const service = inject(PortfolioService);
  const portfolioId = route.paramMap.get('id');

  if (!portfolioId) {
    // If there's no ID, prevent navigation and redirect.
    router.navigate(['/portfolio']);
    return false;
  }

  return service.getPortfolioById(portfolioId).pipe(
    switchMap((portfolio: Portfolio) => {
      if (!portfolio) return of(false);

      route.data = {
        ...route.data,
        portfolioData: portfolio,
      };

      return of(true);
    }),
  );
};
