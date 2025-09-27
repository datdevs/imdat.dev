import { AsyncPipe } from '@angular/common';
import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule, Routes } from '@angular/router';
import { TuiIcon } from '@taiga-ui/core';
import { filter } from 'rxjs/operators';

import { ProfileButtonComponent } from '../../components/profile-button/profile-button.component';

export interface MenuItem {
  icon: string;
  isActive?: boolean;
  path: string;
  title: string;
}

@Component({
  selector: 'app-main',
  imports: [AsyncPipe, RouterModule, ProfileButtonComponent, TuiIcon],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  mainMenu: Routes = [];
  title = '';
  isSidebarCollapsed = signal(false);

  private readonly router = inject(Router);

  menuItems = computed(() => {
    return this.mainMenu.map((route) => ({
      path: route.path ?? '',
      title: (route.title as string) || '',
      icon: route.data?.['icon'] ?? 'circle',
      isActive: this.router.url.includes(route.path ?? ''),
    }));
  });

  private readonly route = inject(ActivatedRoute);

  constructor() {
    this.getTitle();
    this.getMainMenu();
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  toggleSidebar() {
    this.isSidebarCollapsed.update((collapsed) => !collapsed);
  }

  private checkScreenSize() {
    if (window.innerWidth < 1024) {
      this.isSidebarCollapsed.set(true);
    }
  }

  private getChild(activatedRoute: ActivatedRoute): ActivatedRoute {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
  }

  private getMainMenu() {
    this.mainMenu = this.route.routeConfig?.children?.filter((route) => route?.data?.['mainMenu']) ?? [];
  }

  private getTitle() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      const route = this.getChild(this.route);
      this.title =
        route.routeConfig?.title && typeof route.routeConfig?.title === 'string' ? route.routeConfig?.title : '';
    });
  }
}
