import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { User } from '@angular/fire/auth';
import { RouterModule } from '@angular/router';
import { TuiAutoColorPipe, TuiDataList, TuiDropdown, TuiFallbackSrcPipe, TuiIcon, TuiOptionNew } from '@taiga-ui/core';
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
    TuiOptionNew,
  ],
  templateUrl: './profile-button.html',
  styleUrl: './profile-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileButton {
  private readonly authStore = inject(AuthStore);
  readonly isSigningOut: Signal<boolean> = computed(() => this.authStore.isSigningOut());
  private readonly authService = inject(AuthService);
  readonly user: Signal<null | User> = computed(() => this.authService.user());

  signOut() {
    this.authStore.signOut();
  }
}
