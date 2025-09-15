import { Component, effect, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';

import { GridComponent } from '../../layouts/grid/grid.component';
import { UserActions } from '../../store/user/user.actions';
import { selectUserLoading } from '../../store/user/user.selectors';
import { LoginForm } from '../../types/forms';

@Component({
  selector: 'app-login',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    GridComponent,
    ReactiveFormsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private store = inject(Store);
  readonly loading = this.store.selectSignal(selectUserLoading);
  loginForm: FormGroup<LoginForm> = new FormGroup<LoginForm>({
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
