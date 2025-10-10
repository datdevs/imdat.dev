import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, type, withComputed, withMethods, withState } from '@ngrx/signals';
import { entityConfig, setAllEntities, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap } from 'rxjs';

import { CreatePortfolioRequest, Portfolio, PortfolioFilters } from '../../models/portfolio';
import { NotifyService, PortfolioService } from '../../services';
import { FirebaseError } from '@angular/fire/app';

export interface PortfolioState {
  filters: null | PortfolioFilters;
  isSubmitting: boolean;
  loading: boolean;
  searchTerm: string;
}

const initialState: PortfolioState = {
  filters: null,
  isSubmitting: false,
  loading: false,
  searchTerm: '',
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

    // Statistics
    totalPortfolios: computed(() => _portfoliosEntities().length),
  })),
  withMethods((store) => {
    const portfolioService = inject(PortfolioService);
    const router = inject(Router);
    const notify = inject(NotifyService);

    // Load all portfolios
    const loadPortfolios = rxMethod<null | PortfolioFilters>(
      pipe(
        switchMap((filters) => {
          patchState(store, { loading: true, filters: filters ?? null });
          return portfolioService.getPortfolios(filters ?? undefined).pipe(
            tapResponse({
              next: (portfolios) => {
                patchState(store, setAllEntities(portfolios, portfolioEntityConfig), {
                  loading: false,
                });
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
                loadPortfolios(store.filters());
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
                loadPortfolios(store.filters());
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

    // // Update portfolio order
    // updatePortfolioOrder: rxMethod<string[]>(
    //   pipe(
    //     switchMap((portfolioIds) => {
    //       patchState(store, { loading: true, error: null });
    //       return portfolioService.updatePortfolioOrder(portfolioIds).pipe(
    //         tapResponse({
    //           next: (success) => {
    //             if (success) {
    //               // Reload portfolios to get updated order
    //               store.loadPortfolios(store.filters());
    //               patchState(store, { loading: false });
    //             } else {
    //               patchState(store, {
    //                 loading: false,
    //                 error: 'Failed to update portfolio order',
    //               });
    //             }
    //           },
    //           error: (error) => {
    //             patchState(store, {
    //               loading: false,
    //               error: error.message || 'Failed to update portfolio order',
    //             });
    //           },
    //         }),
    //       );
    //     }),
    //   ),
    // ),

    return { loadPortfolios, createPortfolio, deletePortfolio };
  }),
);
