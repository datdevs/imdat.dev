import { ApplicationConfig, inject, isDevMode, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { initializeAppCheck, provideAppCheck, ReCaptchaV3Provider } from '@angular/fire/app-check';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { PreloadAllModules, provideRouter, TitleStrategy, withPreloading } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { firebaseConfig } from '../config/firebase';
import { appRoutes } from './app.routes';
import { AuthService, initializeNotifyService, NotifyService, PageTitleService } from './services';
import { UserEffects } from './store/user/user.effects';
import * as fromUser from './store/user/user.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAppCheck(() =>
      initializeAppCheck(getApp(), {
        provider: new ReCaptchaV3Provider('6Lf8-ioqAAAAAALOhjPzaUXUiSSNotkDMNU_Citq'),
      }),
    ),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes, withPreloading(PreloadAllModules) /* withDebugTracing() */),
    provideAnimationsAsync(),
    provideStore(),
    provideEffects(UserEffects),
    provideState(fromUser.USER_FEATURE_KEY, fromUser.userReducer),
    provideStoreDevtools({ logOnly: !isDevMode() }),
    provideAppInitializer(() => {
      const initializerFn = initializeNotifyService(inject(NotifyService));
      return initializerFn();
    }),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'outline',
      },
    },
    { provide: TitleStrategy, useClass: PageTitleService },
    AuthService,
    NotifyService,
  ],
};
