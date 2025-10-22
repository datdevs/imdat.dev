import { withDevToolsStub } from '@angular-architects/ngrx-toolkit';

import { Environment } from '../../models/common';

export const environment: Environment = {
  firebaseConfig: {
    apiKey: '$VITE_FIREBASE_API_KEY',
    appId: '$VITE_FIREBASE_APP_ID',
    authDomain: '$VITE_FIREBASE_AUTH_DOMAIN',
    measurementId: '$VITE_FIREBASE_MEASUREMENT_ID',
    messagingSenderId: '$VITE_FIREBASE_MESSAGING_SENDER_ID',
    projectId: '$VITE_FIREBASE_PROJECT_ID',
    storageBucket: '$VITE_FIREBASE_STORAGE_BUCKET',
  },
  recaptchaV3SiteKey: '$VITE_RECAPTCHA_V3_SITE_KEY',
  storeWithDevTools: withDevToolsStub,
};
