export interface Pagination<T> {
  cursor?: 'next' | 'prev';
  firstDoc?: T;
  lastDoc?: T;
  limit: number;
  orderBy: keyof T;
  orderDirection: 'asc' | 'desc';
  page: number; // 1-based page number
  total?: number;
}
