import { inject, Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, updateProfile, User, user } from '@angular/fire/auth';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);

  public user$ = user(this.auth);

  signIn(username: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, username, password));
  }

  signOut() {
    return from(signOut(this.auth));
  }

  updateProfile(userProfile: { displayName?: string; photoURL?: string }) {
    return from(updateProfile(this.auth.currentUser!, userProfile));
  }
}
