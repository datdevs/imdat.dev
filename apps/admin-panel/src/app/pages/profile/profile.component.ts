import { ChangeDetectionStrategy, Component, computed, effect, inject, Signal } from '@angular/core';
import { User } from '@angular/fire/auth';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { AuthStore } from '../../store/auth';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  private readonly authStore = inject(AuthStore);
  readonly loading: Signal<boolean> = computed(() => this.authStore.isSigningOut());
  private readonly authService = inject(AuthService);
  readonly user: Signal<null | User> = computed(() => this.authService.user());

  profileForm = new FormGroup({
    displayName: new FormControl('', { nonNullable: true, validators: Validators.required }),
    email: new FormControl({
      disabled: true,
      value: '',
    }),
    phoneNumber: new FormControl(''),
    photoURL: new FormControl(''),
  });

  constructor() {
    effect(() => {
      if (this.user()) {
        this.profileForm.patchValue({
          displayName: this.user()?.displayName ?? '',
          email: this.user()?.email,
          photoURL: this.user()?.photoURL,
        });
      }
    });
  }

  save() {
    this.profileForm.markAllAsTouched();

    if (this.profileForm.invalid) return;

    const { displayName, photoURL } = this.profileForm.value;

    if (!displayName || !photoURL) return;

    this.authStore.updateProfile({ userProfile: { displayName, photoURL } });
  }
}
