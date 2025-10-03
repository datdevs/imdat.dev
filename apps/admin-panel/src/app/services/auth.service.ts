import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Auth, signInWithEmailAndPassword, signOut, updateProfile, user } from '@angular/fire/auth';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly auth = inject(Auth);

  readonly user = toSignal(user(this.auth), { initialValue: null });

  signIn(username: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, username, password));
  }

  signOut() {
    return from(signOut(this.auth));
  }

  updateProfile(userProfile: { displayName?: string; photoURL?: string }) {
    if (!this.auth.currentUser) {
      throw new Error('User not found');
    }

    return from(updateProfile(this.auth.currentUser, userProfile));
  }
}
