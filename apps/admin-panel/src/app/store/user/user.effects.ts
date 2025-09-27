import { inject, Injectable } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { UserCredential } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, of, switchMap, tap } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService, NotifyService } from '../../services';
import { UserActions } from './user.actions';

@Injectable()
export class UserEffects {
  private readonly actions$ = inject(Actions);
  private readonly auth = inject(AuthService);
  private readonly notify = inject(NotifyService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.login),
      switchMap(({ username, password }) =>
        this.auth.signIn(username, password).pipe(
          map((userCredential: UserCredential) => UserActions.loginSuccess({ uid: userCredential.user.uid })),
          catchError((error: FirebaseError) => {
            let message = 'Failed to login';

            switch (error.code) {
              case 'auth/invalid-credential':
                message = 'Invalid credentials';
                break;
              case 'auth/invalid-email':
                message = 'Invalid email';
                break;
              default:
                break;
            }

            this.notify.error(message);
            return of(UserActions.loginFailure({ error }));
          }),
          tap(async () => {
            const returnUrl = this.route.snapshot.queryParams['returnUrl']
              ? decodeURIComponent(this.route.snapshot.queryParams['returnUrl'])
              : '/dashboard';
            await this.router.navigateByUrl(returnUrl); // Navigate to the intended route or the dashboard
          }),
        ),
      ),
    );
  });

  logout$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.logout),
      switchMap(() =>
        this.auth.signOut().pipe(
          map(() => UserActions.logoutSuccess()),
          catchError((error: FirebaseError) => {
            this.notify.error(error.code || 'Failed to logout');
            return of(UserActions.logoutFailure({ error }));
          }),
          tap(async () => {
            await this.router.navigate(['/login']);
          }),
        ),
      ),
    );
  });

  updateProfile$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.updateProfile),
      switchMap(({ userProfile }) =>
        this.auth.updateProfile(userProfile).pipe(
          map(() => UserActions.updateProfileSuccess()),
          catchError((error: FirebaseError) => {
            this.notify.error(error.code || 'Failed to update profile');
            return of(UserActions.updateProfileFailure({ error }));
          }),
          tap(() => {
            this.notify.success('Profile updated successfully');
          }),
        ),
      ),
    );
  });
}
