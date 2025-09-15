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
  private actions$ = inject(Actions);
  private auth = inject(AuthService);
  private notify = inject(NotifyService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  login$ = createEffect(() =>
    { return this.actions$.pipe(
      ofType(UserActions.login),
      switchMap(({ password, username }) =>
        this.auth.signIn(username, password).pipe(
          map((userCredential: UserCredential) => UserActions.loginSuccess({ uid: userCredential.user.uid })),
          catchError((error: FirebaseError) => {
            this.notify.error(error.code || 'Error logging in');
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
    ) },
  );

  logout$ = createEffect(() =>
    { return this.actions$.pipe(
      ofType(UserActions.logout),
      switchMap(() =>
        this.auth.signOut().pipe(
          map(() => UserActions.logoutSuccess()),
          catchError((error: FirebaseError) => {
            this.notify.error(error.code || 'Error logging out');
            return of(UserActions.logoutFailure({ error }));
          }),
          tap(async () => {
            await this.router.navigate(['/login']);
          }),
        ),
      ),
    ) },
  );

  updateProfile$ = createEffect(() =>
    { return this.actions$.pipe(
      ofType(UserActions.updateProfile),
      switchMap(({ userProfile }) =>
        this.auth.updateProfile(userProfile).pipe(
          map(() => UserActions.updateProfileSuccess()),
          catchError((error: FirebaseError) => {
            this.notify.error(error.code || 'Error updating profile');
            return of(UserActions.updateProfileFailure({ error }));
          }),
          tap(() => {
            this.notify.success('Profile updated successfully');
          }),
        ),
      ),
    ) },
  );
}
