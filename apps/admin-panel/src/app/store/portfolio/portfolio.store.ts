import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, type, withComputed, withMethods, withState } from '@ngrx/signals';
import { entityConfig, setAllEntities, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap } from 'rxjs';

import { CreatePortfolioRequest, Portfolio, PortfolioFilters } from '../../models/portfolio';
import { NotifyService, PortfolioService } from '../../services';

export interface PortfolioState {
  filters: null | PortfolioFilters;
  isSubmitting: boolean;
  loading: boolean;
  searchTerm: string;
  selectedPortfolioId: null | string;
}

const initialState: PortfolioState = {
  filters: null,
  isSubmitting: false,
  loading: false,
  searchTerm: '',
  selectedPortfolioId: null,
};

const portfolioEntityConfig = entityConfig({
  entity: type<Portfolio>(),
  collection: 'portfolios',
  selectId: (portfolio: Portfolio) => portfolio.id,
});

export const PortfolioStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withEntities(portfolioEntityConfig),
  withComputed(({ portfoliosEntities, selectedPortfolioId, portfoliosEntityMap }) => ({
    // Get all portfolios as array
    portfolios: computed(() => portfoliosEntities()),

    // Get selected portfolio
    selectedPortfolio: computed(() => {
      const id = selectedPortfolioId();
      return id ? portfoliosEntityMap()[id] : undefined;
    }),

    // Get published portfolios only
    publishedPortfolios: computed(() => portfoliosEntities().filter((portfolio) => portfolio.status === 'published')),

    // Get featured portfolios
    featuredPortfolios: computed(() =>
      portfoliosEntities().filter((portfolio) => portfolio.featured && portfolio.status === 'published'),
    ),

    // Get draft portfolios
    draftPortfolios: computed(() => portfoliosEntities().filter((portfolio) => portfolio.status === 'draft')),

    // Get portfolios by technology
    portfoliosByTechnology: computed(
      () => (technologies: string[]) =>
        portfoliosEntities().filter(
          (portfolio) =>
            portfolio.status === 'published' && technologies.some((tech) => portfolio.technologies.includes(tech)),
        ),
    ),

    // Search portfolios
    searchResults: computed(() => (searchTerm: string) => {
      if (!searchTerm) return portfoliosEntities();

      const term = searchTerm.toLowerCase();
      return portfoliosEntities().filter(
        (portfolio) =>
          portfolio.title.toLowerCase().includes(term) ||
          portfolio.description.toLowerCase().includes(term) ||
          portfolio.shortDescription.toLowerCase().includes(term) ||
          portfolio.technologies.some((tech) => tech.toLowerCase().includes(term)),
      );
    }),

    // Statistics
    totalPortfolios: computed(() => portfoliosEntities().length),
    publishedCount: computed(() => portfoliosEntities().filter((p) => p.status === 'published').length),
    draftCount: computed(() => portfoliosEntities().filter((p) => p.status === 'draft').length),
    featuredCount: computed(() => portfoliosEntities().filter((p) => p.featured).length),
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
                patchState(store, setAllEntities(portfolios as Portfolio[], portfolioEntityConfig), {
                  loading: false,
                });
              },
              error: () => {
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
              error: () => {
                notify.error('Failed to create portfolio');
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

    // // Delete portfolio
    // deletePortfolio: rxMethod<string>(
    //   pipe(
    //     switchMap((id) => {
    //       patchState(store, { loading: true, error: null });
    //       return portfolioService.deletePortfolio(id).pipe(
    //         tapResponse({
    //           next: (success) => {
    //             if (success) {
    //               patchState(store, removeEntity(id, portfolioEntityConfig), {
    //                 loading: false,
    //               });
    //             } else {
    //               patchState(store, {
    //                 loading: false,
    //                 error: 'Failed to delete portfolio',
    //               });
    //             }
    //           },
    //           error: (error) => {
    //             patchState(store, {
    //               loading: false,
    //               error: error.message || 'Failed to delete portfolio',
    //             });
    //           },
    //         }),
    //       );
    //     }),
    //   ),
    // ),

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

    return { loadPortfolios, createPortfolio };
  }),
);
