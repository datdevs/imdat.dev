import { inject } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { User, UserCredential } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

import { AUTH_CODE } from '../../core/constants';
import { LoginCredentials } from '../../models/forms';
import { AuthService, NotifyService } from '../../services';

interface AuthState {
  isSigningIn: boolean;
  isSigningOut: boolean;
  isUpdatingProfile: boolean;
  user: null | User;
}

const initialState: AuthState = {
  isSigningIn: false,
  isSigningOut: false,
  isUpdatingProfile: false,
  user: null,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (
      store,
      auth = inject(AuthService),
      notify = inject(NotifyService),
      router = inject(Router),
      route = inject(ActivatedRoute),
    ) => {
      const signIn = rxMethod<LoginCredentials>(
        pipe(
          tap(() => patchState(store, { isSigningIn: true })),
          switchMap(({ username, password }) =>
            auth.signIn(username, password).pipe(
              tapResponse({
                next: (credential: UserCredential) => patchState(store, { user: credential.user }),
                error: (err: FirebaseError) => {
                  let message = 'Failed to login';

                  switch (err.code) {
                    case AUTH_CODE.INVALID_CREDENTIAL:
                      message = 'Invalid credentials';
                      break;
                    case AUTH_CODE.INVALID_EMAIL:
                      message = 'Invalid email';
                      break;
                    case AUTH_CODE.USER_NOT_FOUND:
                      message = 'User not found';
                      break;
                    default:
                      break;
                  }

                  notify.error(message);
                },
                complete: () => {
                  const returnUrl = route.snapshot.queryParams['returnUrl']
                    ? decodeURIComponent(route.snapshot.queryParams['returnUrl'])
                    : '/dashboard';
                  router.navigateByUrl(returnUrl); // Navigate to the intended route or the dashboard
                },
                finalize: () => patchState(store, { isSigningIn: false }),
              }),
            ),
          ),
        ),
      );

      const signOut = rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isSigningOut: true })),
          switchMap(() =>
            auth.signOut().pipe(
              tapResponse({
                next: () => patchState(store, { user: null }),
                error: (err: FirebaseError) => notify.error(err.message || 'Failed to logout'),
                complete: () => {
                  console.log('complete');
                  router.navigate(['/login']);
                },
                finalize: () => patchState(store, { isSigningOut: false }),
              }),
            ),
          ),
        ),
      );

      const updateProfile = rxMethod<{ userProfile: { displayName?: string; photoURL?: string } }>(
        pipe(
          tap(() => patchState(store, { isSigningIn: true })),
          switchMap(({ userProfile }) =>
            auth.updateProfile(userProfile).pipe(
              tapResponse({
                next: () => notify.success('Profile updated successfully'),
                error: (err: FirebaseError) => notify.error(err.message || 'Failed to update profile'),
                finalize: () => patchState(store, { isUpdatingProfile: false }),
              }),
            ),
          ),
        ),
      );

      return { signIn, signOut, updateProfile };
    },
  ),
);

// export const ChangelogStore = signalStore(
//   { protectedState: false }, withState(initialState),
//   withComputed(({ changelog, filterVersion }, sanitizer = inject(DomSanitizer)) => ({
//     changelogSafe: computed<ChangelogHistory<SafeHtml> | null>(() => {
//       const currentChangelog = changelog();
//       const version = filterVersion();

//       return currentChangelog
//         ? {
//             ...currentChangelog,
//             results: currentChangelog?.results
//               ?.filter((c) => !version || c.framework.version === version)
//               ?.map((c) => ({
//                 ...c,
//                 framework: {
//                   ...c.framework,
//                   html_content: c.framework.html_content
//                     ? sanitizer.bypassSecurityTrustHtml(
//                         '<style>' + c.framework.style_content + '</style>' + c.framework.html_content,
//                       )
//                     : null,
//                 },
//               })),
//           }
//         : null;
//     }),

//     versions: computed<OptionItem[]>(() => {
//       return [
//         { id: 0, name: 'All', value: '' },
//         ...(changelog()?.results?.map((c) => ({
//           id: c.framework.version,
//           name: c.framework.version,
//           value: c.framework.version,
//         })) || []),
//       ];
//     }),
//   })),
//   withMethods((store, changelogService = inject(ChangelogService), notify = inject(NotifyService)) => {
//     const updateFilterVersion = (filterVersion: string) => {
//       patchState(store, (state) => ({ ...state, filterVersion }));
//     };

//     const updateChangelogFilter = (filter: Partial<ChangelogFilter>) => {
//       patchState(store, (state) => ({ ...state, changelogFilter: { ...state.changelogFilter, ...filter } }));
//     };

//     const syncChangelog = rxMethod<void>(
//       pipe(
//         debounceTime(300),
//         tap(() => patchState(store, { isSyncing: true })),
//         switchMap(() => {
//           return changelogService.syncChangelog().pipe(
//             tapResponse({
//               next: () => {
//                 notify.success('Changelog synced successfully.');
//                 loadChangelog({ cache: false });
//               },
//               error: (err: HttpErrorResponse) => notify.error(err.error?.message || err.message),
//               finalize: () => patchState(store, { isSyncing: false }),
//             }),
//           );
//         }),
//       ),
//     );

//     const loadChangelog = rxMethod<{ cache: boolean }>(
//       pipe(
//         debounceTime(300),
//         tap(() => patchState(store, { isLoading: true })),
//         switchMap(({ cache }) => {
//           return changelogService.getChangelogHistory(store.changelogFilter(), cache).pipe(
//             tapResponse({
//               next: (changelog) => patchState(store, { changelog, isLoading: false }),
//               error: (err: HttpErrorResponse) => {
//                 patchState(store, { isLoading: false });
//                 notify.error(err.error?.message || err.message);
//               },
//             }),
//           );
//         }),
//       ),
//     );

//     const approveChangelog = rxMethod<number>(
//       pipe(
//         debounceTime(300),
//         switchMap((id: number) => {
//           return changelogService.approveChangelog(id).pipe(
//             tapResponse({
//               next: () => {
//                 notify.success('Changelog approved successfully.');
//                 loadChangelog({ cache: false });
//               },
//               error: (err: HttpErrorResponse) => notify.error(err.error?.message || err.message),
//             }),
//           );
//         }),
//       ),
//     );

//     return { updateFilterVersion, updateChangelogFilter, loadChangelog, approveChangelog, syncChangelog };
//   }),
// );
