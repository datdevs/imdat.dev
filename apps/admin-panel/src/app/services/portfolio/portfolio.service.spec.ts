import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { of, throwError } from 'rxjs';

import { CreatePortfolioRequest, Portfolio, PortfolioFilters, UpdatePortfolioRequest } from '../../models/portfolio';
import { PortfolioService } from './portfolio.service';

describe('PortfolioService', () => {
  let service: PortfolioService;
  let mockFirestore: jasmine.SpyObj<Firestore>;

  const mockPortfolio: Portfolio = {
    id: '1',
    title: 'E-commerce Website',
    description: 'A full-stack e-commerce application built with Angular and Node.js',
    shortDescription: 'Modern e-commerce platform',
    technologies: ['Angular', 'Node.js', 'MongoDB'],
    features: ['User authentication', 'Product catalog', 'Shopping cart'],
    images: [
      {
        id: 'img1',
        url: 'https://example.com/image1.jpg',
        alt: 'Homepage screenshot',
        isMain: true,
        order: 1,
      },
    ],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/example/repo',
    status: 'published',
    featured: true,
    order: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    publishedAt: new Date('2024-01-01'),
  };

  const mockCreateRequest: CreatePortfolioRequest = {
    title: 'New Project',
    description: 'A new project description',
    shortDescription: 'Short description',
    technologies: ['React', 'TypeScript'],
    features: ['Feature 1', 'Feature 2'],
    images: [
      {
        url: 'https://example.com/new-image.jpg',
        alt: 'New project image',
        isMain: true,
        order: 1,
      },
    ],
    liveUrl: 'https://newproject.com',
    status: 'draft',
    featured: false,
    order: 2,
  };

  beforeEach(() => {
    const firestoreSpy = jasmine.createSpyObj('Firestore', [
      'collection',
      'doc',
      'addDoc',
      'updateDoc',
      'deleteDoc',
      'getDocs',
      'query',
      'where',
      'orderBy',
      'limit',
    ]);

    TestBed.configureTestingModule({
      providers: [PortfolioService, { provide: Firestore, useValue: firestoreSpy }],
    });

    service = TestBed.inject(PortfolioService);
    mockFirestore = TestBed.inject(Firestore) as jasmine.SpyObj<Firestore>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPortfolios', () => {
    it('should return all portfolios when no filters provided', (done) => {
      const mockQuery = jasmine.createSpyObj('Query', ['get']);
      mockQuery.get.and.returnValue(
        Promise.resolve({
          docs: [
            {
              id: '1',
              data: () => mockPortfolio,
            },
          ],
        }),
      );

      mockFirestore.collection.and.returnValue(mockQuery);
      mockFirestore.query.and.returnValue(mockQuery);

      service.getPortfolios().subscribe({
        next: (portfolios) => {
          expect(portfolios).toEqual([mockPortfolio]);
          expect(mockFirestore.collection).toHaveBeenCalledWith('portfolios');
          done();
        },
        error: done.fail,
      });
    });

    it('should return filtered portfolios when filters provided', (done) => {
      const filters: PortfolioFilters = {
        status: 'published',
        featured: true,
      };

      const mockQuery = jasmine.createSpyObj('Query', ['get']);
      mockQuery.get.and.returnValue(
        Promise.resolve({
          docs: [
            {
              id: '1',
              data: () => mockPortfolio,
            },
          ],
        }),
      );

      mockFirestore.collection.and.returnValue(mockQuery);
      mockFirestore.query.and.returnValue(mockQuery);
      mockFirestore.where.and.returnValue(mockQuery);
      mockFirestore.orderBy.and.returnValue(mockQuery);

      service.getPortfolios(filters).subscribe({
        next: (portfolios) => {
          expect(portfolios).toEqual([mockPortfolio]);
          expect(mockFirestore.where).toHaveBeenCalledWith('status', '==', 'published');
          expect(mockFirestore.where).toHaveBeenCalledWith('featured', '==', true);
          done();
        },
        error: done.fail,
      });
    });

    it('should handle error when fetching portfolios fails', (done) => {
      const mockQuery = jasmine.createSpyObj('Query', ['get']);
      mockQuery.get.and.returnValue(Promise.reject(new Error('Firestore error')));

      mockFirestore.collection.and.returnValue(mockQuery);
      mockFirestore.query.and.returnValue(mockQuery);

      service.getPortfolios().subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('Firestore error');
          done();
        },
      });
    });
  });

  describe('getPortfolioById', () => {
    it('should return portfolio when found', (done) => {
      const mockDoc = jasmine.createSpyObj('DocumentSnapshot', ['exists', 'data']);
      mockDoc.exists = true;
      mockDoc.data.and.returnValue(mockPortfolio);

      const mockDocRef = jasmine.createSpyObj('DocumentReference', ['get']);
      mockDocRef.get.and.returnValue(Promise.resolve(mockDoc));

      mockFirestore.doc.and.returnValue(mockDocRef);

      service.getPortfolioById('1').subscribe({
        next: (portfolio) => {
          expect(portfolio).toEqual(mockPortfolio);
          expect(mockFirestore.doc).toHaveBeenCalledWith('portfolios/1');
          done();
        },
        error: done.fail,
      });
    });

    it('should return null when portfolio not found', (done) => {
      const mockDoc = jasmine.createSpyObj('DocumentSnapshot', ['exists']);
      mockDoc.exists = false;

      const mockDocRef = jasmine.createSpyObj('DocumentReference', ['get']);
      mockDocRef.get.and.returnValue(Promise.resolve(mockDoc));

      mockFirestore.doc.and.returnValue(mockDocRef);

      service.getPortfolioById('999').subscribe({
        next: (portfolio) => {
          expect(portfolio).toBeNull();
          done();
        },
        error: done.fail,
      });
    });

    it('should handle error when fetching portfolio fails', (done) => {
      const mockDocRef = jasmine.createSpyObj('DocumentReference', ['get']);
      mockDocRef.get.and.returnValue(Promise.reject(new Error('Document error')));

      mockFirestore.doc.and.returnValue(mockDocRef);

      service.getPortfolioById('1').subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('Document error');
          done();
        },
      });
    });
  });

  describe('createPortfolio', () => {
    it('should create portfolio successfully', (done) => {
      const mockDocRef = jasmine.createSpyObj('DocumentReference', ['id']);
      mockDocRef.id = 'new-id';

      const mockCollection = jasmine.createSpyObj('CollectionReference', ['add']);
      mockCollection.add.and.returnValue(Promise.resolve(mockDocRef));

      mockFirestore.collection.and.returnValue(mockCollection);

      service.createPortfolio(mockCreateRequest).subscribe({
        next: (result) => {
          expect(result.id).toBe('new-id');
          expect(mockCollection.add).toHaveBeenCalledWith(
            jasmine.objectContaining({
              ...mockCreateRequest,
              createdAt: jasmine.any(Date),
              updatedAt: jasmine.any(Date),
            }),
          );
          done();
        },
        error: done.fail,
      });
    });

    it('should handle error when creating portfolio fails', (done) => {
      const mockCollection = jasmine.createSpyObj('CollectionReference', ['add']);
      mockCollection.add.and.returnValue(Promise.reject(new Error('Create error')));

      mockFirestore.collection.and.returnValue(mockCollection);

      service.createPortfolio(mockCreateRequest).subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('Create error');
          done();
        },
      });
    });
  });

  describe('updatePortfolio', () => {
    it('should update portfolio successfully', (done) => {
      const updateRequest: UpdatePortfolioRequest = {
        id: '1',
        title: 'Updated Title',
        status: 'published',
      };

      const mockDocRef = jasmine.createSpyObj('DocumentReference', ['update']);
      mockDocRef.update.and.returnValue(Promise.resolve());

      mockFirestore.doc.and.returnValue(mockDocRef);

      service.updatePortfolio(updateRequest).subscribe({
        next: (result) => {
          expect(result).toBe(true);
          expect(mockDocRef.update).toHaveBeenCalledWith(
            jasmine.objectContaining({
              title: 'Updated Title',
              status: 'published',
              updatedAt: jasmine.any(Date),
            }),
          );
          done();
        },
        error: done.fail,
      });
    });

    it('should handle error when updating portfolio fails', (done) => {
      const updateRequest: UpdatePortfolioRequest = {
        id: '1',
        title: 'Updated Title',
      };

      const mockDocRef = jasmine.createSpyObj('DocumentReference', ['update']);
      mockDocRef.update.and.returnValue(Promise.reject(new Error('Update error')));

      mockFirestore.doc.and.returnValue(mockDocRef);

      service.updatePortfolio(updateRequest).subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('Update error');
          done();
        },
      });
    });
  });

  describe('deletePortfolio', () => {
    it('should delete portfolio successfully', (done) => {
      const mockDocRef = jasmine.createSpyObj('DocumentReference', ['delete']);
      mockDocRef.delete.and.returnValue(Promise.resolve());

      mockFirestore.doc.and.returnValue(mockDocRef);

      service.deletePortfolio('1').subscribe({
        next: (result) => {
          expect(result).toBe(true);
          expect(mockDocRef.delete).toHaveBeenCalled();
          done();
        },
        error: done.fail,
      });
    });

    it('should handle error when deleting portfolio fails', (done) => {
      const mockDocRef = jasmine.createSpyObj('DocumentReference', ['delete']);
      mockDocRef.delete.and.returnValue(Promise.reject(new Error('Delete error')));

      mockFirestore.doc.and.returnValue(mockDocRef);

      service.deletePortfolio('1').subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('Delete error');
          done();
        },
      });
    });
  });

  describe('getFeaturedPortfolios', () => {
    it('should return only featured portfolios', (done) => {
      const mockQuery = jasmine.createSpyObj('Query', ['get']);
      mockQuery.get.and.returnValue(
        Promise.resolve({
          docs: [
            {
              id: '1',
              data: () => mockPortfolio,
            },
          ],
        }),
      );

      mockFirestore.collection.and.returnValue(mockQuery);
      mockFirestore.query.and.returnValue(mockQuery);
      mockFirestore.where.and.returnValue(mockQuery);
      mockFirestore.orderBy.and.returnValue(mockQuery);

      service.getFeaturedPortfolios().subscribe({
        next: (portfolios) => {
          expect(portfolios).toEqual([mockPortfolio]);
          expect(mockFirestore.where).toHaveBeenCalledWith('featured', '==', true);
          expect(mockFirestore.where).toHaveBeenCalledWith('status', '==', 'published');
          done();
        },
        error: done.fail,
      });
    });
  });

  describe('searchPortfolios', () => {
    it('should search portfolios by title and description', (done) => {
      const searchTerm = 'e-commerce';
      const mockQuery = jasmine.createSpyObj('Query', ['get']);
      mockQuery.get.and.returnValue(
        Promise.resolve({
          docs: [
            {
              id: '1',
              data: () => mockPortfolio,
            },
          ],
        }),
      );

      mockFirestore.collection.and.returnValue(mockQuery);
      mockFirestore.query.and.returnValue(mockQuery);
      mockFirestore.where.and.returnValue(mockQuery);
      mockFirestore.orderBy.and.returnValue(mockQuery);

      service.searchPortfolios(searchTerm).subscribe({
        next: (portfolios) => {
          expect(portfolios).toEqual([mockPortfolio]);
          done();
        },
        error: done.fail,
      });
    });
  });
});
