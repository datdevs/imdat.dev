import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { FirebaseOptions } from '@angular/fire/app';

export interface Environment {
  firebaseConfig: FirebaseOptions;
  recaptchaV3SiteKey: string;
  storeWithDevTools: typeof withDevtools;
}
