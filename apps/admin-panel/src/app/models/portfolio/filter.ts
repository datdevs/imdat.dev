import { TuiDayRange } from '@taiga-ui/cdk/date-time';

import { StatusEnum } from '../../core/constants/status';
import { Pagination } from '../common';
import { IPortfolio } from './portfolio.model';

export interface PortfolioFilters extends Pagination<IPortfolio> {
  featured?: boolean;
  features?: string[];
  publishedDateRange?: TuiDayRange;
  statuses?: StatusEnum[];
  technologies?: string[];
  updatedDateRange?: TuiDayRange;
}
