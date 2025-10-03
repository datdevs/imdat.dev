export interface PortfolioFilters {
  featured?: boolean;
  search?: string;
  status?: 'archived' | 'draft' | 'published';
  technologies?: string[];
}
