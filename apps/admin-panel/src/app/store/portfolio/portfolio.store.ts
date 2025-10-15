import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, inject } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { Router } from '@angular/router';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, type, withComputed, withMethods, withState } from '@ngrx/signals';
import { entityConfig, setAllEntities, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { merge, pipe, switchMap } from 'rxjs';

import { CreatePortfolioRequest, Portfolio, PortfolioFilters } from '../../models/portfolio';
import { NotifyService, PortfolioService } from '../../services';

export interface PortfolioState {
  filters: PortfolioFilters;
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
  isSubmitting: false,
  loading: false,
  searchTerm: '',
  totalPortfolios: 0,
};

const portfolioEntityConfig = entityConfig({
  entity: type<Portfolio>(),
  collection: '_portfolios',
  selectId: (portfolio: Portfolio) => portfolio.id,
});

export const PortfolioStore = signalStore(
  { providedIn: 'root' },
  withDevtools('portfolios'),
  withState(initialState),
  withEntities(portfolioEntityConfig),
  withComputed(({ _portfoliosEntities }) => ({
    // Get all portfolios as array
    portfolios: computed(() => _portfoliosEntities()),
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

    // // Load single portfolio by ID
    // loadPortfolioById: rxMethod<string>(
    //   pipe(
    //     switchMap((id) => {
    //       patchState(store, { loading: true, error: null, selectedPortfolioId: id });
    //       return portfolioService.getPortfolioById(id).pipe(
    //         tapResponse({
    //           next: (portfolio) => {
    //             if (portfolio) {
    //               patchState(store, addEntity(portfolio, portfolioEntityConfig), {
    //                 loading: false,
    //               });
    //             } else {
    //               patchState(store, {
    //                 loading: false,
    //                 error: 'Portfolio not found',
    //               });
    //             }
    //           },
    //           error: (error) => {
    //             patchState(store, {
    //               loading: false,
    //               error: error.message || 'Failed to load portfolio',
    //             });
    //           },
    //         }),
    //       );
    //     }),
    //   ),
    // ),

    // Create new portfolio
    const createPortfolio = rxMethod<CreatePortfolioRequest>(
      pipe(
        switchMap((portfolioData) => {
          patchState(store, { isSubmitting: true });
          return portfolioService.createPortfolio(portfolioData).pipe(
            tapResponse({
              next: () => {
                // Reload portfolios to get the new one with all data
                loadPortfolios();
                notify.success('Portfolio was created successfully');
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
    // updatePortfolio: rxMethod<UpdatePortfolioRequest>(
    //   pipe(
    //     switchMap((portfolioData) => {
    //       patchState(store, { loading: true, error: null });
    //       return portfolioService.updatePortfolio(portfolioData).pipe(
    //         tapResponse({
    //           next: (success) => {
    //             if (success) {
    //               // Reload portfolios to get updated data
    //               store.loadPortfolios(store.filters());
    //               patchState(store, { loading: false });
    //             } else {
    //               patchState(store, {
    //                 loading: false,
    //                 error: 'Failed to update portfolio',
    //               });
    //             }
    //           },
    //           error: (error) => {
    //             patchState(store, {
    //               loading: false,
    //               error: error.message || 'Failed to update portfolio',
    //             });
    //           },
    //         }),
    //       );
    //     }),
    //   ),
    // ),

    // Delete portfolio
    const deletePortfolio = rxMethod<string>(
      pipe(
        switchMap((id: string) => {
          patchState(store, { loading: true });
          return portfolioService.deletePortfolio(id).pipe(
            tapResponse({
              next: () => {
                loadPortfolios();
                notify.success('Portfolio was deleted successfully');
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

    // // Load featured portfolios
    // loadFeaturedPortfolios: rxMethod<void>(
    //   pipe(
    //     switchMap(() => {
    //       patchState(store, { loading: true, error: null });
    //       return portfolioService.getFeaturedPortfolios().pipe(
    //         tapResponse({
    //           next: (portfolios) => {
    //             patchState(store, setAllEntities(portfolios, portfolioEntityConfig), {
    //               loading: false,
    //             });
    //           },
    //           error: (error) => {
    //             patchState(store, {
    //               loading: false,
    //               error: error.message || 'Failed to load featured portfolios',
    //             });
    //           },
    //         }),
    //       );
    //     }),
    //   ),
    // ),

    // // Load portfolios by technology
    // loadPortfoliosByTechnology: rxMethod<string[]>(
    //   pipe(
    //     switchMap((technologies) => {
    //       patchState(store, { loading: true, error: null });
    //       return portfolioService.getPortfoliosByTechnology(technologies).pipe(
    //         tapResponse({
    //           next: (portfolios) => {
    //             patchState(store, setAllEntities(portfolios, portfolioEntityConfig), {
    //               loading: false,
    //             });
    //           },
    //           error: (error) => {
    //             patchState(store, {
    //               loading: false,
    //               error: error.message || 'Failed to load portfolios by technology',
    //             });
    //           },
    //         }),
    //       );
    //     }),
    //   ),
    // ),

    return { updateFilters, loadPortfolios, createPortfolio, deletePortfolio };
  }),
);
