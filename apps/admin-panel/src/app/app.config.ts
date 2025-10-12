import { ApplicationConfig, inject, provideAppInitializer, provideZonelessChangeDetection } from '@angular/core';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { initializeAppCheck, provideAppCheck, ReCaptchaV3Provider } from '@angular/fire/app-check';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import { connectFirestoreEmulator, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAnimations } from '@angular/platform-browser/animations';
import { PreloadAllModules, provideRouter, TitleStrategy, withPreloading } from '@angular/router';
import { tuiDateFormatProvider } from '@taiga-ui/core';
import { provideEventPlugins } from '@taiga-ui/event-plugins';

import { firebaseConfig } from '../config/firebase';
import { appRoutes } from './app.routes';
import { AuthService, initializeNotifyService, NotifyService, PageTitleService } from './services';
import { AuthStore } from './store/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideEventPlugins(),
    provideZonelessChangeDetection(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAppCheck(() =>
      initializeAppCheck(getApp(), {
        provider: new ReCaptchaV3Provider('6Lf8-ioqAAAAAALOhjPzaUXUiSSNotkDMNU_Citq'),
      }),
    ),
    provideAuth(() => {
      const auth = getAuth();
      if (location.hostname === 'localhost') {
        connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
      }
      return auth;
    }),
    provideFirestore(() => {
      const firestore = getFirestore();
      if (location.hostname === 'localhost') {
        connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
      }
      return firestore;
    }),
    provideRouter(appRoutes, withPreloading(PreloadAllModules) /* withDebugTracing() */),
    tuiDateFormatProvider({ mode: 'DMY', separator: '/' }),
    provideAppInitializer(() => {
      const initializerFn = initializeNotifyService(inject(NotifyService));
      return initializerFn();
    }),
    { provide: TitleStrategy, useClass: PageTitleService },
    AuthService,
    NotifyService,
    AuthStore,
  ],
};
