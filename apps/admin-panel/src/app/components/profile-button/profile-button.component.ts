import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { User } from '@angular/fire/auth';
import { RouterModule } from '@angular/router';
import { TuiAutoColorPipe, TuiDataList, TuiDropdown, TuiFallbackSrcPipe, TuiIcon } from '@taiga-ui/core';
import { TuiAvatar } from '@taiga-ui/kit';

import { AuthService } from '../../services/auth.service';
import { AuthStore } from '../../store/auth';

@Component({
  selector: 'app-profile-button',
  imports: [
    AsyncPipe,
    RouterModule,
    TuiIcon,
    TuiDropdown,
    TuiDataList,
    TuiAvatar,
    TuiFallbackSrcPipe,
    TuiAutoColorPipe,
  ],
  templateUrl: './profile-button.component.html',
  styleUrl: './profile-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileButtonComponent {
  private readonly authStore = inject(AuthStore);
  readonly isSigningOut: Signal<boolean> = computed(() => this.authStore.isSigningOut());
  private readonly authService = inject(AuthService);
  readonly user: Signal<null | User> = computed(() => this.authService.user());

  protected openDropdown = false;

  signOut() {
    this.authStore.signOut();
  }
}
