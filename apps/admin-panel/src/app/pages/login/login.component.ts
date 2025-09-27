import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TuiAppearance, TuiButton, TuiError, TuiIcon, TuiLabel, TuiTextfield, TuiTitle } from '@taiga-ui/core';
import { TuiButtonLoading, TuiFieldErrorPipe, TuiPassword, tuiValidationErrorsProvider } from '@taiga-ui/kit';
import { TuiCard, TuiForm, TuiHeader } from '@taiga-ui/layout';

import { UserActions } from '../../store/user/user.actions';
import { selectUserLoading } from '../../store/user/user.selectors';
import { LoginForm } from '../../types/forms';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    TuiAppearance,
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
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [
    tuiValidationErrorsProvider({
      required: 'Field is required',
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly store = inject(Store);
  readonly loading = this.store.selectSignal(selectUserLoading);
  protected loginForm: FormGroup<LoginForm> = new FormGroup<LoginForm>({
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    username: new FormControl<string>('', {
      nonNullable: true,
      validators: Validators.required,
    }),
  });

  constructor() {
    effect(() => {
      if (this.loading()) {
        this.loginForm.disable();
      } else {
        this.loginForm.enable();
      }
    });
  }

  handleSignIn() {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) return;

    const { password, username } = this.loginForm.value;

    if (!username || !password) return;

    this.store.dispatch(UserActions.login({ password, username }));
  }
}
