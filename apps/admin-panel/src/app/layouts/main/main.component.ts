import { ChangeDetectionStrategy, Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import {
  ActivatedRoute,
  Event,
  NavigationEnd,
  Route,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule,
} from '@angular/router';
import { tuiAsPortal, TuiPortals } from '@taiga-ui/cdk';
import {
  TuiAppearance,
  TuiButton,
  TuiDataList,
  TuiDropdown,
  TuiDropdownService,
  TuiIcon,
  TuiTextfield,
} from '@taiga-ui/core';
import { TuiAvatar, TuiBadgedContent, TuiBadgeNotification, TuiChevron, TuiFade, TuiTabs } from '@taiga-ui/kit';
import { TuiNavigation } from '@taiga-ui/layout';
import { filter } from 'rxjs/operators';

import { appRoutes, MenuItem } from '../../app.routes';
import { ProfileButtonComponent } from '../../components/profile-button/profile-button.component';

@Component({
  selector: 'app-main',
  imports: [
    RouterModule,
    TuiIcon,
    ProfileButtonComponent,
    TuiButton,
    TuiBadgedContent,
    TuiAvatar,
    TuiBadgeNotification,
    RouterLink,
    RouterLinkActive,
    TuiAppearance,
    TuiAvatar,
    TuiBadgeNotification,
    TuiButton,
    TuiChevron,
    TuiDataList,
    TuiDropdown,
    TuiFade,
    TuiIcon,
    TuiNavigation,
    TuiTabs,
    TuiTextfield,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  providers: [TuiDropdownService, tuiAsPortal(TuiDropdownService)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent extends TuiPortals {
  readonly title: WritableSignal<string> = signal('');
  readonly currentRoute: WritableSignal<null | Route> = signal<null | Route>(null);
  readonly isSidebarCollapsed: WritableSignal<boolean> = signal<boolean>(false);
  private readonly menus: WritableSignal<MenuItem[]> = signal<MenuItem[]>([]);

  readonly sideNavHeaderMenus: Signal<MenuItem[]> = computed(() =>
    this.menus().filter((menu) => menu.data?.sideNavPosition === 1),
  );

  readonly sideNavMiddleMenus: Signal<MenuItem[]> = computed(() =>
    this.menus().filter((menu) => menu.data?.sideNavPosition === 2),
  );

  readonly sideNavFooterMenus: Signal<MenuItem[]> = computed(() =>
    this.menus().filter((menu) => menu.data?.sideNavPosition === 3),
  );

  protected readonly expanded = signal(false);

  private readonly router = inject(Router);

  private readonly route = inject(ActivatedRoute);

  constructor() {
    super();
    this.getTitle();
    this.getMainMenu();
  }

  protected handleToggle(): void {
    this.expanded.update((e) => !e);
  }

  private getChild(activatedRoute: ActivatedRoute): ActivatedRoute {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
  }

  private getMainMenu() {
    const mainMenu: MenuItem | undefined = appRoutes.find((route: MenuItem) => route.data?.mainMenu);

    if (!mainMenu?.children) {
      return;
    }

    const menus: MenuItem[] = mainMenu.children.filter((route: MenuItem) => route.data?.isShowInMenu) ?? [];

    this.menus.set(menus);
  }

  private getTitle() {
    this.router.events.pipe(filter((event: Event) => event instanceof NavigationEnd)).subscribe(() => {
      const route = this.getChild(this.route);

      this.currentRoute.set(route.routeConfig);
    });
  }
}
