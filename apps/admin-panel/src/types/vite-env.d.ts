/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  readonly FIREBASE_API_KEY: string;
  readonly FIREBASE_APP_ID: string;
  readonly FIREBASE_AUTH_DOMAIN: string;
  readonly FIREBASE_MEASUREMENT_ID: string;
  readonly FIREBASE_MESSAGING_SENDER_ID: string;
  readonly FIREBASE_PROJECT_ID: string;
  readonly FIREBASE_STORAGE_BUCKET: string;
  readonly RECAPTCHA_V3_SITE_KEY: string;
}
