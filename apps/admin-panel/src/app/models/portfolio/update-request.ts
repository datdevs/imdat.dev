import { CreatePortfolioRequest } from './create-request';

export interface UpdatePortfolioRequest extends Partial<CreatePortfolioRequest> {
  id: string;
}
