import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  endBefore,
  Firestore,
  getDoc,
  limit,
  limitToLast,
  orderBy,
  query,
  startAfter,
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

  get collection() {
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

    let q = query(this.collection, orderBy(orderByColumn, orderDirection));

    // Apply filters
    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    }
    if (filters?.featured !== undefined) {
      q = query(q, where('featured', '==', filters.featured));
    }
    if (filters?.technologies && filters.technologies.length > 0) {
      q = query(q, where('technologies', 'array-contains-any', filters.technologies));
    }

    // Apply pagination
    if (filters?.cursor === 'next') {
      if (filters?.lastDoc) {
        q = query(q, startAfter(filters?.lastDoc?.[orderByColumn]), limit(filters?.limit ?? 10));
      }
    } else if (filters?.cursor === 'prev') {
      if (filters?.firstDoc) {
        q = query(q, endBefore(filters?.firstDoc?.[orderByColumn]), limitToLast(filters?.limit ?? 10));
      }
    } else {
      q = query(q, limit(filters?.limit ?? 10));
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
    let q = query(this.collection, orderBy('order', 'asc'));

    // Apply filters
    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    }
    if (filters?.featured !== undefined) {
      q = query(q, where('featured', '==', filters.featured));
    }
    if (filters?.technologies && filters.technologies.length > 0) {
      q = query(q, where('technologies', 'array-contains-any', filters.technologies));
    }

    return collectionData(q, { idField: 'id' }).pipe(map((portfolios) => portfolios.length));
  }

  /**
   * Get a single portfolio by ID
   */
  getPortfolioById(id: string): Observable<null | Portfolio> {
    const portfolioDoc = doc(this.firestore, this.collectionName, id);

    return from(getDoc(portfolioDoc)).pipe(
      map((docSnapshot) => {
        if (!docSnapshot.exists()) {
          return null;
        }

        const data = docSnapshot.data();
        return {
          id: docSnapshot.id,
          ...data,
          createdAt: data['createdAt']?.toDate() ?? new Date(),
          updatedAt: data['updatedAt']?.toDate() ?? new Date(),
          publishedAt: data['publishedAt']?.toDate(),
        } as Portfolio;
      }),
    );
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

    return from(addDoc(this.collection, portfolioToCreate)).pipe(map((docRef) => ({ id: docRef.id })));
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
   * Update portfolio order
   */
  updatePortfolioOrder(portfolioIds: string[]): Observable<boolean> {
    const updates = portfolioIds.map((id, index) =>
      updateDoc(doc(this.firestore, this.collectionName, id), {
        order: index + 1,
        updatedAt: new Date(),
      }),
    );

    return from(Promise.all(updates)).pipe(
      map(() => true),
      catchError((error) => {
        console.error('Error updating portfolio order:', error);
        throw error;
      }),
    );
  }
}
