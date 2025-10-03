import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  orderBy,
  query,
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

  /**
   * Get all portfolios with optional filters
   */
  getPortfolios(filters?: PortfolioFilters): Observable<Portfolio[]> {
    const portfolioCollection = collection(this.firestore, this.collectionName);
    let q = query(portfolioCollection, orderBy('order', 'asc'));

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

    return from(getDocs(q)).pipe(
      map((snapshot) => {
        const portfolios: Portfolio[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          portfolios.push({
            id: doc.id,
            ...data,
            createdAt: data['createdAt']?.toDate() ?? new Date(),
            updatedAt: data['updatedAt']?.toDate() ?? new Date(),
            publishedAt: data['publishedAt']?.toDate(),
          } as Portfolio);
        });

        // Apply search filter if provided
        if (filters?.search) {
          const searchTerm = filters.search.toLowerCase();
          return portfolios.filter(
            (portfolio) =>
              portfolio.title.toLowerCase().includes(searchTerm) ||
              portfolio.description.toLowerCase().includes(searchTerm) ||
              portfolio.shortDescription.toLowerCase().includes(searchTerm),
          );
        }

        return portfolios;
      }),
      catchError((error) => {
        console.error('Error fetching portfolios:', error);
        throw error;
      }),
    );
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
      catchError((error) => {
        console.error('Error fetching portfolio:', error);
        throw error;
      }),
    );
  }

  /**
   * Create a new portfolio
   */
  createPortfolio(portfolioData: CreatePortfolioRequest): Observable<{ id: string }> {
    const portfolioCollection = collection(this.firestore, this.collectionName);
    const now = new Date();

    const portfolioToCreate = {
      ...portfolioData,
      createdAt: now,
      updatedAt: now,
      publishedAt: portfolioData.status === 'published' ? now : undefined,
    };

    return from(addDoc(portfolioCollection, portfolioToCreate)).pipe(
      map((docRef) => ({ id: docRef.id })),
      catchError((error) => {
        console.error('Error creating portfolio:', error);
        throw error;
      }),
    );
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
   */
  deletePortfolio(id: string): Observable<boolean> {
    const portfolioDoc = doc(this.firestore, this.collectionName, id);

    return from(deleteDoc(portfolioDoc)).pipe(
      map(() => true),
      catchError((error) => {
        console.error('Error deleting portfolio:', error);
        throw error;
      }),
    );
  }

  /**
   * Get featured portfolios (published and featured)
   */
  getFeaturedPortfolios(): Observable<Portfolio[]> {
    return this.getPortfolios({
      status: 'published',
      featured: true,
    });
  }

  /**
   * Search portfolios by title and description
   */
  searchPortfolios(searchTerm: string): Observable<Portfolio[]> {
    return this.getPortfolios({
      search: searchTerm,
    });
  }

  /**
   * Get portfolios by technology
   */
  getPortfoliosByTechnology(technologies: string[]): Observable<Portfolio[]> {
    return this.getPortfolios({
      technologies,
      status: 'published',
    });
  }

  /**
   * Get published portfolios only
   */
  getPublishedPortfolios(): Observable<Portfolio[]> {
    return this.getPortfolios({
      status: 'published',
    });
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
