import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ActivatedRoute,
  Event,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule,
} from '@angular/router';
import { TuiAppearance, TuiButton, TuiDataList, TuiDropdown, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiAvatar, TuiBadgedContent, TuiBadgeNotification, TuiChevron, TuiFade, TuiTabs } from '@taiga-ui/kit';
import { TuiNavigation } from '@taiga-ui/layout';
import { filter } from 'rxjs/operators';

import { appRoutes, MenuItem } from '../../app.routes';
import { ProfileButton } from '../../components/profile-button/profile-button';

@Component({
  selector: 'app-main-layout',
  imports: [
    RouterModule,
    ProfileButton,
    TuiButton,
    TuiBadgedContent,
    TuiAvatar,
    RouterLink,
    RouterLinkActive,
    TuiAppearance,
    TuiBadgeNotification,
    TuiChevron,
    TuiDataList,
    TuiDropdown,
    TuiFade,
    TuiIcon,
    TuiNavigation,
    TuiTabs,
    TuiTextfield,
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout {
  readonly title: WritableSignal<string> = signal('');
  readonly currentRoute: WritableSignal<MenuItem | null> = signal<MenuItem | null>(null);
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

  private readonly route = inject(ActivatedRoute);

  readonly currentRouteTitle: Signal<string> = computed(() => {
    const route = this.currentRoute();
    if (!route) return 'Admin Panel';

    const hierarchy = this.getRouteHierarchy(this.getChild(this.route));

    // First try to find title in hierarchy (child to parent)
    for (const routeConfig of hierarchy) {
      if (routeConfig.title && typeof routeConfig.title === 'string') {
        return routeConfig.title;
      }
    }

    if (typeof route.title === 'string') {
      return route.title;
    }

    // Fallback to current route title
    return 'Admin Panel';
  });

  readonly currentRouteIcon: Signal<string> = computed(() => {
    const route = this.currentRoute();
    if (!route) return 'cloud-alert';

    const hierarchy = this.getRouteHierarchy(this.getChild(this.route));

    // First try to find icon in hierarchy (child to parent)
    for (const routeConfig of hierarchy) {
      if (routeConfig.data?.icon) {
        return routeConfig.data.icon;
      }
    }

    // Fallback to current route icon
    return route.data?.icon ?? 'cloud-alert';
  });

  readonly canCreate: Signal<boolean> = computed(() => {
    const route = this.currentRoute();
    if (!route) return false;

    const hierarchy = this.getRouteHierarchy(this.getChild(this.route));

    // Check if any route in hierarchy allows create
    for (const routeConfig of hierarchy) {
      if (routeConfig.data?.allowCreate) {
        return true;
      }
    }

    return false;
  });

  protected readonly expanded = signal(false);

  private readonly destroyRef = inject(DestroyRef);

  private readonly router = inject(Router);

  constructor() {
    // super();
    this.getTitle();
    this.getMainMenu();
  }

  protected handleToggle(): void {
    this.expanded.update((e) => !e);
  }

  protected create() {
    if (!this.canCreate()) {
      return;
    }

    this.router.navigate([this.router.url, 'create']);
  }

  private getChild(activatedRoute: ActivatedRoute): ActivatedRoute {
    let child = activatedRoute;
    while (child.firstChild) {
      child = child.firstChild;
    }
    return child;
  }

  private getRouteHierarchy(activatedRoute: ActivatedRoute): MenuItem[] {
    const hierarchy: MenuItem[] = [];
    let currentRoute = activatedRoute;

    // Collect all route configs from child to parent
    while (currentRoute) {
      if (currentRoute.routeConfig) {
        hierarchy.unshift(currentRoute.routeConfig as MenuItem);
      }
      currentRoute = currentRoute.parent!;
    }

    return hierarchy;
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
    this.router.events
      .pipe(
        filter((event: Event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        const route = this.getChild(this.route);

        this.currentRoute.set(route.routeConfig);
      });
  }
}
