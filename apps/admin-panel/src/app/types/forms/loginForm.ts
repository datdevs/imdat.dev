import { FormControl } from '@angular/forms';

export interface LoginForm {
  password: FormControl<string>;
  username: FormControl<string>;
}
