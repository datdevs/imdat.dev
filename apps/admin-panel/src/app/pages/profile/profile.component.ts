import { Component, effect, inject, Signal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { User } from '@angular/fire/auth';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';

import { LoadingOverlayComponent } from '../../components/loading-overlay/loading-overlay.component';
import { AuthService } from '../../services';
import { UserActions } from '../../store/user/user.actions';
import { selectUserLoading } from '../../store/user/user.selectors';

@Component({
  selector: 'app-profile',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinner,
    LoadingOverlayComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  private store = inject(Store);
  readonly loading = this.store.selectSignal(selectUserLoading);
  profileForm = new FormGroup({
    displayName: new FormControl('', { nonNullable: true, validators: Validators.required }),
    email: new FormControl({
      disabled: true,
      value: '',
    }),
    phoneNumber: new FormControl(''),
    photoURL: new FormControl(''),
  });

  user: Signal<null | User> = signal(null);
  private auth = inject(AuthService);

  constructor() {
    effect(() => {
      // if (this.loading()) {
      //   this.profileForm.disable();
      // } else {
      //   this.profileForm.enable();
      // }

      if (this.user()) {
        this.profileForm.patchValue({
          displayName: this.user()?.displayName || '',
          email: this.user()?.email,
          photoURL: this.user()?.photoURL,
        });
      }
    });

    this.user = toSignal(this.auth.user$, { initialValue: null });
  }

  save() {
    this.profileForm.markAllAsTouched();

    if (this.profileForm.invalid) return;

    const { displayName, photoURL } = this.profileForm.value;

    this.store.dispatch(UserActions.updateProfile({ userProfile: { displayName, photoURL: photoURL || '' } }));
  }
}
