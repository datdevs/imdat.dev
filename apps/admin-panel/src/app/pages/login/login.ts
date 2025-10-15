import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiError, TuiIcon, TuiLabel, TuiTextfield, TuiTitle } from '@taiga-ui/core';
import { TuiButtonLoading, TuiFieldErrorPipe, TuiPassword, tuiValidationErrorsProvider } from '@taiga-ui/kit';
import { TuiCard, TuiForm, TuiHeader } from '@taiga-ui/layout';

import { LoginFormControls } from '../../models/forms';
import { AuthStore } from '../../store/auth';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    TuiForm,
    TuiCard,
    TuiHeader,
    TuiTitle,
    TuiTextfield,
    TuiLabel,
    TuiError,
    TuiFieldErrorPipe,
    TuiIcon,
    TuiPassword,
    TuiButton,
    TuiButtonLoading,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  providers: [
    tuiValidationErrorsProvider({
      required: 'Field is required',
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly authStore = inject(AuthStore);

  readonly loading = computed(() => this.authStore.isSigningIn());

  protected loginForm: FormGroup<LoginFormControls> = new FormGroup<LoginFormControls>({
    username: new FormControl<string>('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: Validators.required,
    }),
  });

  constructor() {
    effect(() => {
      if (this.authStore.isSigningIn()) {
        this.loginForm.disable();
      } else {
        this.loginForm.enable();
      }
    });
  }

  handleSignIn() {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) return;

    const { username, password } = this.loginForm.value;

    if (!username || !password) return;

    this.authStore.signIn({ username, password });
  }
}
