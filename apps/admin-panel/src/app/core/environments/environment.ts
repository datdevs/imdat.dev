import { withDevtools } from '@angular-architects/ngrx-toolkit';

import { Environment } from '../../models/common';

export const environment: Environment = {
  firebaseConfig: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  },
  recaptchaV3SiteKey: import.meta.env.VITE_RECAPTCHA_V3_SITE_KEY,
  storeWithDevTools: withDevtools,
};
