import { createFeatureSelector, createSelector } from '@ngrx/store';

import { USER_FEATURE_KEY, UserState } from './user.reducer';

// Lookup the 'User' feature state managed by NgRx
export const selectUserState = createFeatureSelector<UserState>(USER_FEATURE_KEY);

export const selectUserLoading = createSelector(selectUserState, (state: UserState) => state.loading);

export const selectUserError = createSelector(selectUserState, (state: UserState) => state.error);
