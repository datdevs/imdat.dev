import { StatusEnum } from '../../core/constants/status';
import { Pagination } from '../common';
import { Portfolio } from './portfolio';

export interface PortfolioFilters extends Pagination<Portfolio> {
  featured?: boolean;
  status?: StatusEnum;
  technologies?: string[];
}
