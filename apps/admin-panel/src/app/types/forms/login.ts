import { FormControl } from '@angular/forms';

export interface LoginCredentials {
  password: string;
  username: string;
}

export interface LoginFormControls {
  password: FormControl<string>;
  username: FormControl<string>;
}
