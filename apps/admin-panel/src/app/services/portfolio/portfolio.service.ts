import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  DocumentData,
  endBefore,
  Firestore,
  limit,
  limitToLast,
  or,
  orderBy,
  Query,
  query,
  startAfter,
  Timestamp,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { CreatePortfolioRequest, Portfolio, PortfolioFilters, UpdatePortfolioRequest } from '../../models/portfolio';

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  private readonly firestore = inject(Firestore);
  private readonly collectionName = 'portfolios';

  get collectionConfig() {
    return collection(this.firestore, this.collectionName);
  }

  /**
   * Get all portfolios with optional filters
   * @param {PortfolioFilters} filters
   * @returns {Observable<Portfolio[]>}
   */
  getPortfolios(filters?: PortfolioFilters): Observable<Portfolio[]> {
    const orderByColumn = filters?.orderBy ?? 'updatedAt';
    const orderDirection = filters?.orderDirection ?? 'desc';

    let q = query(this.collectionConfig, orderBy(orderByColumn, orderDirection));

    q = this._applyFilters(q, filters);

    // Apply pagination
    if (filters?.cursor === 'next') {
      if (filters?.lastDoc) {
        q = query(q, startAfter(filters?.lastDoc?.[orderByColumn]), limit(Number(filters?.limit ?? 10)));
      }
    } else if (filters?.cursor === 'prev') {
      if (filters?.firstDoc) {
        q = query(q, endBefore(filters?.firstDoc?.[orderByColumn]), limitToLast(Number(filters?.limit ?? 10)));
      }
    } else {
      q = query(q, limit(Number(filters?.limit ?? 10)));
    }

    return collectionData(q, {
      idField: 'id',
    }) as Observable<Portfolio[]>;
  }

  /**
   * Get the count of all portfolios
   * @returns {Observable<number>}
   */
  getPortfoliosCount(filters?: PortfolioFilters): Observable<number> {
    let q = query(this.collectionConfig);

    q = this._applyFilters(q, filters);

    return collectionData(q, { idField: 'id' }).pipe(map((portfolios) => portfolios.length));
  }

  /**
   * Get a single portfolio by ID
   */
  getPortfolioById(id: string): Observable<Portfolio> {
    return docData(doc(this.firestore, this.collectionName, id), { idField: 'id' }) as Observable<Portfolio>;
  }

  /**
   * Create a new portfolio
   * @param {CreatePortfolioRequest} portfolioData
   * @returns {Observable<{ id: string }>}
   */
  createPortfolio(portfolioData: CreatePortfolioRequest): Observable<{ id: string }> {
    const now = new Date();

    const portfolioToCreate = {
      ...portfolioData,
      createdAt: now,
      updatedAt: now,
      publishedAt: portfolioData.status === 'published' ? now : null,
    };

    return from(addDoc(this.collectionConfig, portfolioToCreate)).pipe(map((docRef) => ({ id: docRef.id })));
  }

  /**
   * Update an existing portfolio
   */
  updatePortfolio(portfolioData: UpdatePortfolioRequest): Observable<boolean> {
    const { id, ...updateData } = portfolioData;
    const portfolioDoc = doc(this.firestore, this.collectionName, id);

    const updatePayload = {
      ...updateData,
      updatedAt: new Date(),
      publishedAt: updateData.status === 'published' && !updateData.publishedAt ? new Date() : undefined,
    };

    return from(updateDoc(portfolioDoc, updatePayload)).pipe(
      map(() => true),
      catchError((error) => {
        console.error('Error updating portfolio:', error);
        throw error;
      }),
    );
  }

  /**
   * Delete a portfolio
   * @param {string} id
   * @returns {Observable<void>}
   */
  deletePortfolio(id: string): Observable<void> {
    const portfolioDoc = doc(this.firestore, this.collectionName, id);

    return from(deleteDoc(portfolioDoc));
  }

  /**
   * Apply filters to a query
   * @param {Query<DocumentData, DocumentData>} q
   * @param {PortfolioFilters} filters
   * @returns {Query<DocumentData, DocumentData>}
   */
  private _applyFilters(
    q: Query<DocumentData, DocumentData>,
    filters?: PortfolioFilters,
  ): Query<DocumentData, DocumentData> {
    if (filters?.statuses && filters.statuses.length > 0) {
      q = query(q, where('status', 'in', filters.statuses));
    }
    if (filters?.featured !== undefined) {
      q = query(q, where('featured', '==', filters.featured));
    }
    q = query(
      q,
      or(
        ...(filters?.features && filters.features.length > 0
          ? [where('features', 'array-contains-any', filters.features)]
          : []),
        ...(filters?.technologies && filters.technologies.length > 0
          ? [where('technologies', 'array-contains-any', filters.technologies)]
          : []),
      ),
    );
    if (filters?.updatedDateRange) {
      q = query(
        q,
        where('updatedAt', '>=', Timestamp.fromDate(filters.updatedDateRange.from.toLocalNativeDate())),
        where('updatedAt', '<=', Timestamp.fromDate(filters.updatedDateRange.to.toLocalNativeDate())),
      );
    }
    if (filters?.publishedDateRange) {
      q = query(
        q,
        where('publishedAt', '>=', Timestamp.fromDate(filters.publishedDateRange.from.toLocalNativeDate())),
        where('publishedAt', '<=', Timestamp.fromDate(filters.publishedDateRange.to.toLocalNativeDate())),
      );
    }
    return q;
  }
}
