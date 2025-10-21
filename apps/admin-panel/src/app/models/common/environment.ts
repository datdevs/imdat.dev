import { withDevtools } from '@angular-architects/ngrx-toolkit';

export interface Environment {
  storeWithDevTools: typeof withDevtools;
}
