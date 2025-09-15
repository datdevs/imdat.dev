import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const UserActions = createActionGroup({
  events: {
    Login: props<{ password: string; username: string }>(),
    LoginFailure: props<{ error: any }>(),
    LoginSuccess: props<{ uid: string }>(),

    Logout: emptyProps(),
    LogoutFailure: props<{ error: any }>(),
    LogoutSuccess: emptyProps(),

    UpdateProfile: props<{ userProfile: { displayName?: string; photoURL?: string } }>(),
    UpdateProfileFailure: props<{ error: any }>(),
    UpdateProfileSuccess: emptyProps(),

    // Reload: emptyProps(),
  },
  source: 'User Page',
});
