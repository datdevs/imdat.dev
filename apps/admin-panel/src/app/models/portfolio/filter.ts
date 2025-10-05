import { StatusEnum } from '../../core/constants/status';
import { Pagination } from '../common';

export interface PortfolioFilters extends Pagination {
  featured?: boolean;
  search?: string;
  status?: StatusEnum;
  technologies?: string[];
}
