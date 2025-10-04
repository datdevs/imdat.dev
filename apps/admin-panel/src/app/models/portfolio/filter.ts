import { Pagination } from '../common';
import { PortfolioStatus } from './portfolio';

export interface PortfolioFilters extends Pagination {
  featured?: boolean;
  search?: string;
  status?: PortfolioStatus;
  technologies?: string[];
}
