import { Component, inject, OnDestroy, OnInit, Signal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { User } from '@angular/fire/auth';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';

import { AuthService } from '../../services';
import { UserActions } from '../../store/user/user.actions';
import { selectUserLoading } from '../../store/user/user.selectors';

@Component({
  selector: 'app-profile-button',
  imports: [MatMenuModule, MatIcon, MatProgressSpinner, RouterModule],
  templateUrl: './profile-button.component.html',
  styleUrl: './profile-button.component.scss'
})
export class ProfileButtonComponent implements OnDestroy, OnInit {
  private store = inject(Store);

  readonly loading = this.store.selectSignal(selectUserLoading);
  user: Signal<null | User> = signal(null);

  private auth = inject(AuthService);

  constructor() {
    this.user = toSignal(this.auth.user$, { initialValue: null });
  }

  ngOnInit(): void {
    console.log('ngOnInit');
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy');
  }

  signOut() {
    this.store.dispatch(UserActions.logout());
  }
}
