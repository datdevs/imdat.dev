import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, inject } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { Router } from '@angular/router';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, type, withComputed, withMethods, withState } from '@ngrx/signals';
import { entityConfig, setAllEntities, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { merge, pipe, switchMap } from 'rxjs';

import { IPortfolio, PortfolioFilters, PortfolioRequestBody } from '../../models/portfolio';
import { NotifyService, PortfolioService } from '../../services';

export interface PortfolioState {
  filters: PortfolioFilters;
  isDashboardLoading: boolean;
  isRecentPortfoliosLoading: boolean;
  isSubmitting: boolean;
  loading: boolean;
  searchTerm: string;
  totalPortfolios: number;
}

const initialState: PortfolioState = {
  filters: {
    limit: 10,
    page: 1,
    orderBy: 'updatedAt',
    orderDirection: 'desc',
  },
  isDashboardLoading: false,
  isRecentPortfoliosLoading: false,
  isSubmitting: false,
  loading: false,
  searchTerm: '',
  totalPortfolios: 0,
};

const portfolioEntityConfig = entityConfig({
  entity: type<IPortfolio>(),
  collection: '_portfolios',
  selectId: (portfolio: IPortfolio) => portfolio.id,
});

const dashboardEntityConfig = entityConfig({
  entity: type<IPortfolio>(),
  collection: '_dashboard_portfolios',
  selectId: (portfolio: IPortfolio) => portfolio.id,
});

const recentPortfoliosEntityConfig = entityConfig({
  entity: type<IPortfolio>(),
  collection: '_recent_portfolios',
  selectId: (portfolio: IPortfolio) => portfolio.id,
});

export const PortfolioStore = signalStore(
  { providedIn: 'root' },
  withDevtools('portfolios'),
  withState(initialState),
  withEntities(portfolioEntityConfig),
  withEntities(dashboardEntityConfig),
  withEntities(recentPortfoliosEntityConfig),
  withComputed(({ _portfoliosEntities, _dashboard_portfoliosEntities, _recent_portfoliosEntities }) => ({
    // Get all portfolios as array
    portfolios: computed(() => _portfoliosEntities()),
    dashboardPortfolios: computed(() => _dashboard_portfoliosEntities()),
    recentPortfolios: computed(() => _recent_portfoliosEntities()),
  })),
  withMethods((store) => {
    const portfolioService = inject(PortfolioService);
    const router = inject(Router);
    const notify = inject(NotifyService);

    // Update filters
    const updateFilters = (filters: Partial<PortfolioFilters>) => {
      patchState(store, (state) => ({ ...state, filters: { ...state.filters, ...filters } }));
    };

    // Load all portfolios
    const loadPortfolios = rxMethod<void>(
      pipe(
        switchMap(() => {
          patchState(store, { loading: true });
          return merge(
            portfolioService.getPortfolios(store.filters()),
            portfolioService.getPortfoliosCount(store.filters()),
          ).pipe(
            tapResponse({
              next: (result) => {
                if (typeof result === 'number') {
                  patchState(store, {
                    totalPortfolios: result,
                    loading: false,
                  });
                } else {
                  patchState(store, setAllEntities(result, portfolioEntityConfig), {
                    loading: false,
                  });
                  patchState(store, (state) => ({
                    ...state,
                    filters: {
                      ...state.filters,
                      lastDoc: result[result.length - 1],
                      firstDoc: result[0],
                      cursor: undefined,
                    },
                  }));
                }
              },
              error: (error: FirebaseError) => {
                notify.error(error.message ?? 'Failed to load portfolios');
                patchState(store, {
                  loading: false,
                });
              },
            }),
          );
        }),
      ),
    );

    const loadRecentPortfolios = rxMethod<void>(
      pipe(
        switchMap(() => {
          patchState(store, { isRecentPortfoliosLoading: true });
          return portfolioService
            .getPortfolios({
              limit: 5,
              orderBy: 'updatedAt',
              orderDirection: 'desc',
            })
            .pipe(
              tapResponse({
                next: (portfolios: IPortfolio[]) =>
                  patchState(store, setAllEntities(portfolios, recentPortfoliosEntityConfig), {
                    isRecentPortfoliosLoading: false,
                  }),
                error: (error: FirebaseError) => {
                  notify.error(error.message ?? 'Failed to load recent portfolios');
                  patchState(store, { isRecentPortfoliosLoading: false });
                },
              }),
            );
        }),
      ),
    );

    const loadDashboardPortfolios = rxMethod<void>(
      pipe(
        switchMap(() => {
          patchState(store, { isDashboardLoading: true });
          return portfolioService.getPortfolios({ orderBy: 'updatedAt', orderDirection: 'desc' }).pipe(
            tapResponse({
              next: (portfolios: IPortfolio[]) =>
                patchState(store, setAllEntities(portfolios, dashboardEntityConfig), { isDashboardLoading: false }),
              error: (error: FirebaseError) => {
                notify.error(error.message ?? 'Failed to load dashboard portfolios');
                patchState(store, { isDashboardLoading: false });
              },
            }),
          );
        }),
      ),
    );

    // Create new portfolio
    const createPortfolio = rxMethod<PortfolioRequestBody>(
      pipe(
        switchMap((portfolioData) => {
          patchState(store, { isSubmitting: true });
          return portfolioService.createPortfolio(portfolioData).pipe(
            tapResponse({
              next: () => {
                // Reload portfolios to get the new one with all data
                loadPortfolios();
                notify.success('IPortfolio was created successfully');
                router.navigate(['/portfolio']);
              },
              error: (error: FirebaseError) => {
                notify.error(error.message ?? 'Failed to create portfolio');
              },
              finalize: () => patchState(store, { isSubmitting: false }),
            }),
          );
        }),
      ),
    );

    // // Update portfolio
    const updatePortfolio = rxMethod<{ id: string; payload: PortfolioRequestBody }>(
      pipe(
        switchMap(({ id, payload }) => {
          patchState(store, { isSubmitting: true });
          return portfolioService.updatePortfolio(id, payload).pipe(
            tapResponse({
              next: () => {
                // Reload portfolios to get the new one with all data
                loadPortfolios();
                notify.success('IPortfolio was updated successfully');
                router.navigate(['/portfolio']);
              },
              error: (error: FirebaseError) => {
                notify.error(error.message ?? 'Failed to update portfolio');
              },
              finalize: () => patchState(store, { isSubmitting: false }),
            }),
          );
        }),
      ),
    );

    // Delete portfolio
    const deletePortfolio = rxMethod<string>(
      pipe(
        switchMap((id: string) => {
          patchState(store, { loading: true });
          return portfolioService.deletePortfolio(id).pipe(
            tapResponse({
              next: () => {
                loadPortfolios();
                notify.success('IPortfolio was deleted successfully');
              },
              error: (error: FirebaseError) => {
                notify.error(error.message ?? 'Failed to delete portfolio');
              },
              finalize: () => patchState(store, { loading: false }),
            }),
          );
        }),
      ),
    );

    // // Search portfolios
    // searchPortfolios: rxMethod<string>(
    //   pipe(
    //     switchMap((searchTerm) => {
    //       patchState(store, {
    //         loading: true,
    //         error: null,
    //         searchTerm,
    //       });
    //       return portfolioService.searchPortfolios(searchTerm).pipe(
    //         tapResponse({
    //           next: (portfolios) => {
    //             patchState(store, setAllEntities(portfolios, portfolioEntityConfig), {
    //               loading: false,
    //             });
    //           },
    //           error: (error) => {
    //             patchState(store, {
    //               loading: false,
    //               error: error.message || 'Failed to search portfolios',
    //             });
    //           },
    //         }),
    //       );
    //     }),
    //   ),
    // ),

    return {
      updateFilters,
      loadPortfolios,
      createPortfolio,
      updatePortfolio,
      deletePortfolio,
      loadRecentPortfolios,
      loadDashboardPortfolios,
    };
  }),
);
