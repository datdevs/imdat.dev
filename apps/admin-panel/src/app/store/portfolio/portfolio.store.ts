import { computed, inject } from '@angular/core';
import { patchState, signalStore, type, withComputed, withMethods, withState } from '@ngrx/signals';
import { entityConfig, withEntities } from '@ngrx/signals/entities';

import { Portfolio, PortfolioFilters } from '../../models/portfolio';
import { PortfolioService } from '../../services';

export interface PortfolioState {
  error: null | string;
  filters: null | PortfolioFilters;
  loading: boolean;
  searchTerm: string;
  selectedPortfolioId: null | string;
}

const initialState: PortfolioState = {
  loading: false,
  error: null,
  selectedPortfolioId: null,
  filters: null,
  searchTerm: '',
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
  withMethods((store, _portfolioService = inject(PortfolioService)) => ({
    // Load all portfolios
    // loadPortfolios: rxMethod<PortfolioFilters | void>(
    //   pipe(
    //     switchMap((filters) => {
    //       patchState(store, { loading: true, error: null, filters: filters || null });
    //       return portfolioService.getPortfolios(filters || undefined).pipe(
    //         tapResponse({
    //           next: (portfolios) => {
    //             patchState(store, setAllEntities(portfolios, portfolioEntityConfig), {
    //               loading: false,
    //             });
    //           },
    //           error: (error) => {
    //             patchState(store, {
    //               loading: false,
    //               error: error.message || 'Failed to load portfolios',
    //             });
    //           },
    //         }),
    //       );
    //     }),
    //   ),
    // ),

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

    // // Create new portfolio
    // createPortfolio: rxMethod<CreatePortfolioRequest>(
    //   pipe(
    //     switchMap((portfolioData) => {
    //       patchState(store, { loading: true, error: null });
    //       return portfolioService.createPortfolio(portfolioData).pipe(
    //         tapResponse({
    //           next: () => {
    //             // Reload portfolios to get the new one with all data
    //             store.loadPortfolios(store.filters());
    //             patchState(store, { loading: false });
    //           },
    //           error: (error) => {
    //             patchState(store, {
    //               loading: false,
    //               error: error.message || 'Failed to create portfolio',
    //             });
    //           },
    //         }),
    //       );
    //     }),
    //   ),
    // ),

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

    // Select portfolio
    selectPortfolio(id: null | string): void {
      patchState(store, { selectedPortfolioId: id });
    },

    // Clear error
    clearError(): void {
      patchState(store, { error: null });
    },

    // Set filters
    setFilters(filters: null | PortfolioFilters): void {
      patchState(store, { filters });
    },

    // Clear search
    clearSearch(): void {
      patchState(store, { searchTerm: '' });
    },
  })),
);
