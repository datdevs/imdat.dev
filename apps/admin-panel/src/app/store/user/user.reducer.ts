import { User } from '@angular/fire/auth';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import { UserActions } from './user.actions';

export const USER_FEATURE_KEY = 'user';

export interface UserPartialState {
  readonly [USER_FEATURE_KEY]: UserState;
}

export interface UserState extends EntityState<User> {
  error?: unknown; // last known error (if any)
  loading: boolean; // has the User list been loaded
  selectedId?: number | string; // which User record has been selected
}

export const userAdapter: EntityAdapter<User> = createEntityAdapter<User>({
  selectId: (user: User) => user.uid,
});

export const initialUserState: UserState = userAdapter.getInitialState({
  // set initial required properties
  loading: false,
});

const reducer = createReducer(
  initialUserState,

  on(UserActions.login, (state) => ({ ...state, error: null, loading: true })),
  on(UserActions.loginSuccess, (state) => ({ ...state, loading: false })),
  on(UserActions.loginFailure, (state, { error }) => ({ ...state, error, loading: false })),

  on(UserActions.logout, (state) => ({ ...state, error: null, loading: true })),
  on(UserActions.logoutSuccess, (state) => ({ ...state, loading: false })),
  on(UserActions.logoutFailure, (state, { error }) => ({ ...state, error, loading: false })),

  on(UserActions.updateProfile, (state) => ({ ...state, error: null, loading: true })),
  on(UserActions.updateProfileSuccess, (state) => ({ ...state, loading: false })),
  on(UserActions.updateProfileFailure, (state, { error }) => ({ ...state, error, loading: false })),
);

export function userReducer(state: undefined | UserState, action: Action) {
  return reducer(state, action);
}
