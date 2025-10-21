import { withDevtools } from '@angular-architects/ngrx-toolkit';

import { Environment } from '../../models/common';

export const environment: Environment = {
  storeWithDevTools: withDevtools,
};
